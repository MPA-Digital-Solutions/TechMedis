import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
        {/* Google Tag Manager */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-MGXVZVCQ');`,
          }}
        />
        {/* Google Ads Pixel */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17987586353"
          strategy="afterInteractive"
        />
        <Script
          id="google-ads-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17987586353');
            `,
          }}
        />
        <Script
          id="google-ads-conversions"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('click', function(e) {
                var classes = ['conversion-cta', 'conversion-formulario', 'conversion-radiologia', 'conversion-mamografia', 'conversion-impresoras', 'conversion-botonwp'];
                for (var i = 0; i < classes.length; i++) {
                  if (e.target.closest('.' + classes[i])) {
                    typeof gtag !== 'undefined' && gtag('event', 'conversion', { 'send_to': 'AW-17987586353' });
                    break;
                  }
                }
              });
            `,
          }}
        />
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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MGXVZVCQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
