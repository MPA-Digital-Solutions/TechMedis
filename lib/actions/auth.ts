"use server";

import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "techmedis_admin_session";

type ActionResponse = {
  success: boolean;
  error?: string;
};

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
    
    // Debug temporal - remover después de confirmar que funciona
    console.log("=== checkAdminSession ===");
    console.log("All cookies:", cookieStore.getAll().map(c => c.name));
    console.log("Session exists:", !!session?.value);
    console.log("=========================");
    
    return !!session?.value;
  } catch (error) {
    console.error("Error in checkAdminSession:", error);
    return false;
  }
}
