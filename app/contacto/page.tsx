import type { Metadata } from "next";
import ContactoClient from "./client";
import { getWhatsAppNumber } from "@/lib/actions/config";

// ISR: Regenerar página cada 5 minutos (300 segundos)
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contacto - Techmedis",
  description: "Contacte a Techmedis para recibir asesoría profesional en equipamiento médico.",
};

export default async function ContactoPage() {
  const whatsappNumber = await getWhatsAppNumber();
  
  return <ContactoClient whatsappNumber={whatsappNumber} />;
}
