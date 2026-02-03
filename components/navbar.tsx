"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CTAButton } from "@/components/cta-button";
import { CategoryDropdown } from "@/components/category-dropdown";
import { MobileCategoryDropdown } from "@/components/mobile-category-dropdown";

const navLinks = [
  { path: "/", label: "Inicio" },
  { path: "/services", label: "Services" },
  { path: "/sobre-nosotros", label: "Nosotros" },
];

const categoryLinks = [
  { category: "clinico" as const, label: "Clínico" },
  { category: "veterinario" as const, label: "Veterinario" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  // Scroll handler optimizado con requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const isScrollingDown = currentScrollY > lastScrollY.current;
          
          // Hide navbar when scrolling down past 100px, show when scrolling up
          if (isScrollingDown && currentScrollY > 100) {
            setIsVisible(false);
          } else {
            setIsVisible(true);
          }
          
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 bg-techmedis-primary transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo - CSS hover en lugar de Framer Motion */}
          <Link href="/" className="flex items-center">
            <picture>
              <source srcSet="/images/logo.webp" type="image/webp" />
              <img 
                src="/images/logo.png" 
                alt="Techmedis" 
                className="h-16 w-auto hover:scale-105 hover:opacity-90 transition-transform duration-300"
              />
            </picture>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Inicio */}
            <Link
              href="/"
              className={`text-sm font-medium transition-colors duration-300 relative py-2 ${
                pathname === "/"
                  ? "text-white"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Inicio
              {pathname === "/" && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </Link>

            {/* Clínico con Dropdown */}
            <CategoryDropdown category="clinico" label="Clínico" pathname={pathname} />

            {/* Veterinario con Dropdown */}
            <CategoryDropdown category="veterinario" label="Veterinario" pathname={pathname} />

            {/* Services */}
            <Link
              href="/services"
              className={`text-sm font-medium transition-colors duration-300 relative py-2 ${
                pathname === "/services"
                  ? "text-white"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Services
              {pathname === "/services" && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </Link>

            {/* Nosotros */}
            <Link
              href="/sobre-nosotros"
              className={`text-sm font-medium transition-colors duration-300 relative py-2 ${
                pathname === "/sobre-nosotros"
                  ? "text-white"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Nosotros
              {pathname === "/sobre-nosotros" && (
                <motion.div
                  layoutId="underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                />
              )}
            </Link>
            
            <CTAButton variant="outline" to="/contacto" className="px-5 py-2 text-sm border-white text-techmedis-primary bg-white hover:bg-white/90">
              Contactar
            </CTAButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-white hover:bg-white/10 transition-colors duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-techmedis-secondary overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {/* Inicio */}
              <Link
                href="/"
                onClick={handleLinkClick}
                className={`block py-3 px-2 text-base font-medium rounded-md transition-colors duration-300 ${
                  pathname === "/"
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                Inicio
              </Link>

              {/* Mobile Category Dropdowns */}
              <MobileCategoryDropdown 
                category="clinico" 
                label="Clínico" 
                onClose={handleLinkClick}
              />
              <MobileCategoryDropdown 
                category="veterinario" 
                label="Veterinario" 
                onClose={handleLinkClick}
              />

              {/* Services */}
              <Link
                href="/services"
                onClick={handleLinkClick}
                className={`block py-3 px-2 text-base font-medium rounded-md transition-colors duration-300 ${
                  pathname === "/services"
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                Services
              </Link>

              {/* Nosotros */}
              <Link
                href="/sobre-nosotros"
                onClick={handleLinkClick}
                className={`block py-3 px-2 text-base font-medium rounded-md transition-colors duration-300 ${
                  pathname === "/sobre-nosotros"
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                Nosotros
              </Link>

              <div className="pt-2">
                <CTAButton variant="outline" to="/contacto" className="w-full text-center block border-white text-techmedis-primary bg-white hover:bg-white/90" onClick={handleLinkClick}>
                  Contactar
                </CTAButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
