"use client";

import { useState } from "react";
import { Download, Eye, Filter, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { updateClientStatus } from "@/lib/actions/clients";
import * as XLSX from "xlsx";

interface Client {
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
}

interface ClientsTableProps {
  clients: Client[];
}

type StatusFilter = "all" | "pending" | "contacted" | "converted";

export function ClientsTable({ clients }: ClientsTableProps) {
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [localClients, setLocalClients] = useState<Client[]>(clients);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "converted":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente";
      case "contacted":
        return "Contactado";
      case "converted":
        return "Convertido";
      default:
        return status;
    }
  };

  const statusOptions: { value: string; label: string }[] = [
    { value: "pending", label: "Pendiente" },
    { value: "contacted", label: "Contactado" },
    { value: "converted", label: "Convertido" },
  ];

  // Filtrar clientes
  const filteredClients = localClients.filter((client) => {
    if (statusFilter === "all") return true;
    return client.status === statusFilter;
  });

  const handleStatusChange = async (clientId: string, newStatus: string) => {
    setUpdatingId(clientId);
    try {
      const result = await updateClientStatus(clientId, newStatus);
      if (result.success) {
        // Actualizar estado local
        setLocalClients((prev) =>
          prev.map((client) =>
            client.id === clientId ? { ...client, status: newStatus } : client
          )
        );
        toast({
          title: "Estado actualizado",
          description: `El estado del cliente ha sido actualizado a ${getStatusLabel(newStatus)}.`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo actualizar el estado.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el estado.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleExportExcel = () => {
    try {
      if (filteredClients.length === 0) {
        toast({
          title: "Sin datos",
          description: "No hay clientes para exportar con los filtros seleccionados.",
          variant: "destructive",
        });
        return;
      }

      const dataToExport = filteredClients.map((client) => ({
        "Nombre": client.name,
        "Email": client.email || "-",
        "Teléfono": client.phone || "-",
        "Empresa": client.company || "-",
        "Mensaje": client.message,
        "Fuente": client.source === "contact_form" ? "Formulario" : client.source,
        "Estado": getStatusLabel(client.status),
        "Fecha": formatDate(client.createdAt),
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");

      // Ajustar ancho de columnas
      worksheet["!cols"] = [
        { wch: 20 },
        { wch: 25 },
        { wch: 15 },
        { wch: 20 },
        { wch: 40 },
        { wch: 12 },
        { wch: 12 },
        { wch: 18 },
      ];

      const fileName = statusFilter === "all" 
        ? `clientes_${new Date().toISOString().split("T")[0]}.xlsx`
        : `clientes_${statusFilter}_${new Date().toISOString().split("T")[0]}.xlsx`;

      XLSX.writeFile(workbook, fileName);

      toast({
        title: "Excel exportado",
        description: `Se descargaron ${filteredClients.length} cliente${filteredClients.length !== 1 ? "s" : ""} correctamente.`,
      });
    } catch (error) {
      console.error("Error exporting Excel:", error);
      toast({
        title: "Error",
        description: "No se pudo exportar el archivo Excel.",
        variant: "destructive",
      });
    }
  };

  if (localClients.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-3">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-600 font-medium">No hay consultas de clientes aún</p>
        <p className="text-gray-500 text-sm">Las consultas apareceran aquí cuando los usuarios completen el formulario de contacto.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros y Botones */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all bg-white cursor-pointer text-sm"
          >
            <option value="all">Todos los estados ({localClients.length})</option>
            <option value="pending">
              Pendiente ({localClients.filter(c => c.status === "pending").length})
            </option>
            <option value="contacted">
              Contactado ({localClients.filter(c => c.status === "contacted").length})
            </option>
            <option value="converted">
              Convertido ({localClients.filter(c => c.status === "converted").length})
            </option>
          </select>
        </div>

        <button
          onClick={handleExportExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors cursor-pointer font-medium text-sm w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4" />
          Exportar ({filteredClients.length})
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {filteredClients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="font-medium mb-1">Sin resultados</p>
            <p className="text-sm">No hay clientes con el estado "{getStatusLabel(statusFilter)}"</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        {client.company && (
                          <p className="text-sm text-gray-500">{client.company}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${client.email}`}
                        className="text-techmedis-primary hover:underline text-sm break-all"
                      >
                        {client.email || "-"}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`tel:${client.phone}`}
                        className="text-techmedis-primary hover:underline text-sm"
                      >
                        {client.phone || "-"}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={client.status}
                          onChange={(e) =>
                            handleStatusChange(client.id, e.target.value)
                          }
                          disabled={updatingId === client.id}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full border-0 cursor-pointer transition-all ${getStatusBadgeColor(
                            client.status
                          )} ${
                            updatingId === client.id
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:shadow-md"
                          }`}
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {updatingId === client.id && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-full pointer-events-none">
                            <Loader2 className="w-3 h-3 animate-spin text-current" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(client.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          setExpandedId(expandedId === client.id ? null : client.id)
                        }
                        className="inline-flex items-center justify-center p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Ver detalles completos"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Expanded Message View */}
        {expandedId && (
          <div className="bg-techmedis-light border-t border-gray-200">
            {filteredClients.map(
              (client) =>
                client.id === expandedId && (
                  <div key={client.id} className="p-6 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">
                          Información Completa
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Nombre:</span>
                            <p className="text-gray-600">{client.name}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Email:</span>
                            <p className="text-gray-600">{client.email || "-"}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Teléfono:</span>
                            <p className="text-gray-600">{client.phone || "-"}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Empresa:</span>
                            <p className="text-gray-600">{client.company || "-"}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-1">
                          Detalles
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Fuente:</span>
                            <p className="text-gray-600">
                              {client.source === "contact_form" ? "Formulario de Contacto" : client.source}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Estado:</span>
                            <p className="text-gray-600">
                              {getStatusLabel(client.status)}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Fecha de Consulta:</span>
                            <p className="text-gray-600">
                              {formatDate(client.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Mensaje de Consulta
                      </h3>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                          {client.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
