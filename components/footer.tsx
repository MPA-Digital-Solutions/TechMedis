import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-techmedis-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white">Techmedis</h3>
            <p className="text-white/80 text-sm mb-6 leading-relaxed">
              Equipamiento médico de precisión y soluciones tecnológicas para clínicas y hospitales con respaldo técnico garantizado.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/techmedis" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/techmedis" target="_blank" rel="noopener noreferrer" className="text-white/70 hover:text-white transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">Enlaces</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/equipamientos-medicos" className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
                  Equipamiento Clínico
                </Link>
              </li>
              <li>
                <Link href="/equipamiento-veterinario" className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
                  Equipamiento Veterinario
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-white/80 hover:text-white transition-colors duration-300 text-sm">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">Servicios</h3>
            <ul className="space-y-3">
              <li className="text-white/80 text-sm">Asesoría Técnica</li>
              <li className="text-white/80 text-sm">Instalación Certificada</li>
              <li className="text-white/80 text-sm">Mantenimiento Preventivo</li>
              <li className="text-white/80 text-sm">Soporte Técnico 24/7</li>
              <li className="text-white/80 text-sm">Capacitación de Personal</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6 text-white">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-white/80 text-sm">
                <Phone size={18} className="text-white/70 mt-0.5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3 text-white/80 text-sm">
                <Mail size={18} className="text-white/70 mt-0.5 flex-shrink-0" />
                <span>info@techmedis.com</span>
              </li>
              <li className="flex items-start space-x-3 text-white/80 text-sm">
                <MapPin size={18} className="text-white/70 mt-0.5 flex-shrink-0" />
                <span>Av. Principal 123, Ciudad</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm">
            &copy; {new Date().getFullYear()} Techmedis. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-white/70">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
