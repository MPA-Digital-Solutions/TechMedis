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

    console.log("=== DEBUG loginAdmin ===");
    console.log("Attempting login for user:", username);
    console.log("ADMIN_USER configured:", !!adminUser);
    console.log("ADMIN_PASSWORD configured:", !!adminPassword);

    if (!adminUser || !adminPassword) {
      console.error("Admin credentials not configured in environment");
      return { success: false, error: "Error de configuración del servidor" };
    }

    if (username !== adminUser || password !== adminPassword) {
      console.log("Invalid credentials");
      return { success: false, error: "Credenciales inválidas" };
    }

    console.log("Credentials valid, setting cookie...");

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

    // Verificar que se seteo
    const verifySession = cookieStore.get(ADMIN_SESSION_COOKIE);
    console.log("Cookie set verification:", !!verifySession?.value);
    console.log("NODE_ENV:", process.env.NODE_ENV);
    console.log("Cookie secure:", process.env.NODE_ENV === "production");
    console.log("===========================");

    // Importante: revalidar para que la cookie se propague correctamente
    const { revalidatePath } = await import("next/cache");
    revalidatePath("/admin");

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
    const allCookies = cookieStore.getAll();
    
    console.log("=== DEBUG checkAdminSession ===");
    console.log("All cookies:", allCookies.map(c => c.name));
    console.log("Session cookie:", session);
    console.log("Session value:", session?.value);
    console.log("Result:", !!session?.value);
    console.log("===============================");
    
    return !!session?.value;
  } catch (error) {
    console.error("Error in checkAdminSession:", error);
    return false;
  }
}
