import { getProducts } from "@/lib/actions/products";
import { checkAdminSession } from "@/lib/actions/auth";
import { getAllConfigs } from "@/lib/actions/config";
import { getClients } from "@/lib/actions/clients";
import { AdminDashboard } from "./components/admin-dashboard";
import { AdminLogin } from "./components/admin-login";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const [products, config, clients] = await Promise.all([
    getProducts(),
    getAllConfigs(),
    getClients(),
  ]);

  return <AdminDashboard initialProducts={products} initialConfig={config} initialClients={clients} />;
}
