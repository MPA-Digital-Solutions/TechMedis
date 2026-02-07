"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/actions/clients";

interface ContactoClientProps {
  whatsappNumber: string;
}

// Format phone number for display (e.g., 5491112345678 -> +54 9 11 1234-5678)
function formatPhoneForDisplay(phone: string): string {
  // Remove any non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length >= 10) {
    // Format as international number
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 9)}-${cleaned.slice(9)}`;
  }
  return `+${cleaned}`;
}

export default function ContactoClient({ whatsappNumber }: ContactoClientProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Contact info with dynamic phone number
  const contactInfo = [
    { icon: <Phone size={24} />, label: formatPhoneForDisplay(whatsappNumber), href: `tel:+${whatsappNumber.replace(/\D/g, '')}` },
    { icon: <Mail size={24} />, label: "info@techmedis.com", href: "mailto:info@techmedis.com" },
    { icon: <MapPin size={24} />, label: "Av. Principal 123, Ciudad", href: null },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save contact to database
      const result = await createClient({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
        source: "contact_form",
      });

      if (result.success) {
        toast({
          title: "Mensaje Enviado",
          description: "Redirigiendo a WhatsApp para continuar la conversación...",
        });

        // Build WhatsApp message
        const whatsappMessage = encodeURIComponent(
          `Hola! Soy ${formData.name}${formData.company ? ` de ${formData.company}` : ""}.\n\n${formData.message}\n\nMi contacto:\nEmail: ${formData.email}\nTeléfono: ${formData.phone}`
        );
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

        // Clear form
        setFormData({ name: "", email: "", phone: "", company: "", message: "" });

        // Redirect to WhatsApp after a short delay
        setTimeout(() => {
          window.open(whatsappLink, "_blank");
        }, 1000);
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo enviar el mensaje. Intente nuevamente.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar el mensaje.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct WhatsApp link for quick contact
  const quickWhatsAppLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hola! Me gustaría recibir más información sobre sus productos y servicios.")}`;

  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Contact Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-display text-techmedis-primary mb-8">Contáctenos</h1>
            <p className="text-xl text-techmedis-text mb-12 leading-relaxed font-light">
              Estamos aquí para responder sus consultas técnicas, comerciales o de soporte. Complete el formulario y nuestro equipo especializado le responderá con prioridad.
            </p>

            <div className="space-y-8 mb-16">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center space-x-6 text-techmedis-text">
                  <div className="text-techmedis-secondary p-3 bg-techmedis-light rounded-full">{item.icon}</div>
                  {item.href ? (
                    <a href={item.href} className="text-lg font-medium hover:text-techmedis-primary transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-lg font-medium">{item.label}</span>
                  )}
                </div>
              ))}
            </div>

            {/* Quick WhatsApp Button */}
            <a
              href={quickWhatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl mb-8"
            >
              <MessageCircle className="w-6 h-6" />
              Contactar por WhatsApp directamente
            </a>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white p-8 md:p-10 border border-gray-100 rounded-xl shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-techmedis-text mb-2">Nombre Completo *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-4 bg-techmedis-light/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all outline-none text-techmedis-text placeholder-gray-400"
                  placeholder="Su nombre"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-techmedis-text mb-2">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-techmedis-light/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all outline-none text-techmedis-text placeholder-gray-400"
                    placeholder="email@empresa.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-techmedis-text mb-2">Teléfono *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-4 bg-techmedis-light/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all outline-none text-techmedis-text placeholder-gray-400"
                    placeholder="+1 234 567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-techmedis-text mb-2">Empresa / Clínica</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-techmedis-light/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all outline-none text-techmedis-text placeholder-gray-400"
                  placeholder="Nombre de su institución"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-techmedis-text mb-2">Mensaje *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-4 bg-techmedis-light/50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-techmedis-primary focus:border-transparent transition-all outline-none resize-none text-techmedis-text placeholder-gray-400"
                  placeholder="¿En qué podemos ayudarle?"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2 py-4 text-lg bg-techmedis-primary hover:bg-techmedis-primary/90 text-white px-6 rounded-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Enviando...</span>
                  ) : (
                    <>
                      <span>Enviar y continuar por WhatsApp</span>
                      <Send size={20} />
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Al enviar, guardaremos tu consulta y te redirigiremos a WhatsApp para continuar
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
