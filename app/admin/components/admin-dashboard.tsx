"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Plus,
  ArrowLeft,
  Search,
  Filter,
  LogOut,
  Settings,
  Save,
  Loader2,
  Users,
} from "lucide-react";
import { ProductsTable } from "./products-table";
import { ClientsTable } from "./clients-table";
import { ProductForm } from "./product-form";
import { logoutAdmin } from "@/lib/actions/auth";
import { setConfig } from "@/lib/actions/config";
import { useToast } from "@/components/ui/use-toast";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  type Product,
  type Category,
} from "@/lib/validations/product";

interface AdminDashboardProps {
  initialProducts: Product[];
  initialConfig?: Record<string, string>;
  initialClients?: Array<{
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    message: string;
    source: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

type TabType = "dashboard" | "productos" | "clientes" | "configuracion";

export function AdminDashboard({ initialProducts, initialConfig = {}, initialClients = [] }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("productos");
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(initialConfig.whatsapp_number || "");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAdmin();
    router.refresh();
  };

  const handleSaveConfig = async () => {
    setIsSavingConfig(true);
    try {
      const result = await setConfig("whatsapp_number", whatsappNumber);
      if (result.success) {
        toast({
          title: "Configuración guardada",
          description: "El número de WhatsApp se ha actualizado correctamente.",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo guardar la configuración.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la configuración.",
        variant: "destructive",
      });
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Filtrar productos
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Estadísticas
  const stats = [
    { label: "Total Productos", value: initialProducts.length },
    {
      label: "Clínicos",
      value: initialProducts.filter((p) => p.category === "clinico").length,
    },
    {
      label: "Veterinarios",
      value: initialProducts.filter((p) => p.category === "veterinario").length,
    },
    {
      label: "Activos",
      value: initialProducts.filter((p) => p.status === "active").length,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-techmedis-primary text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Image 
                  src="/images/logo.png" 
                  alt="Techmedis" 
                  width={140}
                  height={48}
                  className="h-12 w-auto"
                />
              </Link>
              <span className="text-white/60 text-sm hidden sm:block">Panel de Administración</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors cursor-pointer text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Volver al sitio</span>
              </Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">{isLoggingOut ? "Saliendo..." : "Cerrar Sesión"}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-72px)] bg-white border-r border-gray-200 p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-techmedis-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("productos")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                activeTab === "productos"
                  ? "bg-techmedis-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Package className="w-5 h-5" />
              Productos
            </button>
            <button
              onClick={() => setActiveTab("clientes")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                activeTab === "clientes"
                  ? "bg-techmedis-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Users className="w-5 h-5" />
              Clientes
            </button>
            <button
              onClick={() => setActiveTab("configuracion")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                activeTab === "configuracion"
                  ? "bg-techmedis-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Settings className="w-5 h-5" />
              Configuración
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeTab === "dashboard" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Dashboard
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-xl border border-gray-200 p-6"
                  >
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-techmedis-primary">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "productos" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Gestión de Productos
                </h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-techmedis-primary text-white rounded-lg hover:bg-techmedis-primary/90 transition-colors cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  Nuevo Producto
                </button>
              </div>

              {/* Filtros */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                      value={categoryFilter}
                      onChange={(e) =>
                        setCategoryFilter(e.target.value as Category | "all")
                      }
                      className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all bg-white cursor-pointer"
                    >
                      <option value="all">Todas las categorías</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {CATEGORY_LABELS[cat]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <ProductsTable products={filteredProducts} />
            </div>
          )}

           {activeTab === "clientes" && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Consultas de Clientes
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">
                    Gestiona todas las consultas recibidas a través del formulario de contacto
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-techmedis-primary">
                    {initialClients.length}
                  </p>
                  <p className="text-gray-500 text-sm">Consultas totales</p>
                </div>
              </div>

              <ClientsTable clients={initialClients} />
            </div>
          )}

           {activeTab === "configuracion" && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Configuración
              </h2>
              
              {/* WhatsApp Config */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contacto WhatsApp
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Este número se usará para los botones de contacto en toda la web. 
                  Los clientes serán redirigidos a este WhatsApp al hacer clic en &quot;Contactar&quot;.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de WhatsApp
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="Ej: 5491112345678"
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all"
                      />
                      <button
                        onClick={handleSaveConfig}
                        disabled={isSavingConfig}
                        className="flex items-center gap-2 px-6 py-3 bg-techmedis-primary text-white rounded-lg hover:bg-techmedis-primary/90 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isSavingConfig ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        Guardar
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Formato: código de país + número sin espacios ni guiones (ej: 5491112345678)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showForm && <ProductForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
