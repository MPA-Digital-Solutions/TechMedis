import type { Metadata } from "next";
import SobreNosotrosClient from "./client";

export const metadata: Metadata = {
  title: "Sobre Nosotros - Techmedis",
  description: "Techmedis: Líderes en equipamiento médico con más de 15 años de experiencia y compromiso con la calidad.",
};

export default function SobreNosotrosPage() {
  return <SobreNosotrosClient />;
}
