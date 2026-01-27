import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "techmedis_admin_session";
const SESSION_DURATION = 60 * 60 * 24; // 24 hours in seconds

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const adminUser = process.env.ADMIN_USER;
    const adminPassword = process.env.ADMIN_PASSWORD;

    console.log("=== API LOGIN ===");
    console.log("Username:", username);
    console.log("ADMIN_USER configured:", !!adminUser);

    if (!adminUser || !adminPassword) {
      return NextResponse.json(
        { success: false, error: "Error de configuración del servidor" },
        { status: 500 }
      );
    }

    if (username !== adminUser || password !== adminPassword) {
      return NextResponse.json(
        { success: false, error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const sessionToken = Buffer.from(
      `${username}:${Date.now()}:${Math.random().toString(36)}`
    ).toString("base64");

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_DURATION,
      path: "/",
    });

    console.log("Cookie set successfully");
    console.log("=================");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
