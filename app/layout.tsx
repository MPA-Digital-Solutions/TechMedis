import type { Metadata, Viewport } from "next";
import { LayoutWrapper } from "@/components/layout-wrapper";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "TechMedis - Equipamiento Médico y Veterinario",
  description: "Soluciones integrales en equipamiento médico y veterinario. Calidad, innovación y servicio profesional.",
  keywords: ["equipamiento médico", "equipamiento veterinario", "tecnología médica", "Argentina"],
  authors: [{ name: "TechMedis" }],
  openGraph: {
    title: "TechMedis - Equipamiento Médico y Veterinario",
    description: "Soluciones integrales en equipamiento médico y veterinario.",
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1F3A5F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Preload fuentes críticas */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
