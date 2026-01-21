import type { Metadata } from "next";
import ContactoClient from "./client";

export const metadata: Metadata = {
  title: "Contacto - Techmedis",
  description: "Contacte a Techmedis para recibir asesoría profesional en equipamiento médico.",
};

export default function ContactoPage() {
  return <ContactoClient />;
}
