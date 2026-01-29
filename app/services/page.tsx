import type { Metadata } from "next";
import ServiciosClient from "./client";

export const metadata: Metadata = {
  title: "Servicios - Techmedis",
  description: "Servicios integrales de soporte, mantenimiento e instalación para equipamiento médico y veterinario.",
};

export default function ServiciosPage() {
  return <ServiciosClient />;
}
