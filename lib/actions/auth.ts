"use server";

import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "techmedis_admin_session";
const SESSION_DURATION = 60 * 60 * 24; // 24 hours in seconds

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function loginAdmin(
  username: string,
  password: string
): Promise<ActionResponse> {
  try {
    const adminUser = process.env.ADMIN_USER;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUser || !adminPassword) {
      console.error("Admin credentials not configured in environment");
      return { success: false, error: "Error de configuración del servidor" };
    }

    if (username !== adminUser || password !== adminPassword) {
      return { success: false, error: "Credenciales inválidas" };
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

    return { success: true };
  } catch (error) {
    console.error("Error during login:", error);
    return { success: false, error: "Error al iniciar sesión" };
  }
}

export async function logoutAdmin(): Promise<ActionResponse> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_SESSION_COOKIE);
    return { success: true };
  } catch (error) {
    console.error("Error during logout:", error);
    return { success: false, error: "Error al cerrar sesión" };
  }
}

export async function checkAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_SESSION_COOKIE);
    return !!session?.value;
  } catch {
    return false;
  }
}
