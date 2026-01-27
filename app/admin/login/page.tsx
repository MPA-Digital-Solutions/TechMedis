import { redirect } from "next/navigation";
import { checkAdminSession } from "@/lib/actions/auth";
import { LoginForm } from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const isAuthenticated = await checkAdminSession();

  // Si ya está logueado, redirigir al admin
  if (isAuthenticated) {
    redirect("/admin");
  }

  return <LoginForm />;
}
