import { getProducts } from "@/lib/actions/products";
import { AdminDashboard } from "./components/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const products = await getProducts();

  return <AdminDashboard initialProducts={products} />;
}
