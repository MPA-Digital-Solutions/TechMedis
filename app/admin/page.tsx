import { redirect } from "next/navigation";
import { getProducts } from "@/lib/actions/products";
import { checkAdminSession } from "@/lib/actions/auth";
import { getAllConfigs } from "@/lib/actions/config";
import { getClients } from "@/lib/actions/clients";
import { AdminDashboard } from "./components/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  // Paginación: cargar solo primeros 50 productos para reducir memoria
  const [products, config, clients] = await Promise.all([
    getProducts({ limit: 50, offset: 0 }),
    getAllConfigs(),
    getClients(),
  ]);

  return <AdminDashboard initialProducts={products} initialConfig={config} initialClients={clients} />;
}
