"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { 
  ClipboardList, 
  Wrench, 
  Shield, 
  Headphones, 
  ArrowRight, 
  Sparkles,
  Stethoscope,
  Heart,
  Award,
  Phone
} from "lucide-react";
import { CTAButton } from "@/components/cta-button";
import { HowWeWork } from "@/components/how-we-work";

const services = [
  { title: "Asesoría Técnica", icon: <ClipboardList className="w-7 h-7" />, desc: "Expertos a su disposición para guiarlo en cada decisión." },
  { title: "Instalación Profesional", icon: <Wrench className="w-7 h-7" />, desc: "Montaje certificado con los más altos estándares." },
  { title: "Garantía Extendida", icon: <Shield className="w-7 h-7" />, desc: "Respaldo total en cada equipo que adquiera." },
  { title: "Soporte 24/7", icon: <Headphones className="w-7 h-7" />, desc: "Asistencia técnica cuando más lo necesite." },
];

const stats = [
  { number: "15+", label: "Años de Experiencia" },
  { number: "500+", label: "Clientes Satisfechos" },
  { number: "1000+", label: "Equipos Instalados" },
  { number: "24/7", label: "Soporte Técnico" },
];

// Hook para detectar si debe reducir animaciones (mobile o preferencia del usuario)
function useReducedMotion() {
  const [shouldReduce, setShouldReduce] = useState(false);
  
  useEffect(() => {
    // Detectar preferencia del usuario
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Detectar mobile (menos de 768px)
    const isMobile = window.innerWidth < 768;
    
    setShouldReduce(mediaQuery.matches || isMobile);
    
    const handler = (e: MediaQueryListEvent) => setShouldReduce(e.matches || isMobile);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  
  return shouldReduce;
}

// Animaciones simplificadas - tipo base
type AnimationState = { opacity: number; y?: number; x?: number };

// Animaciones con movimiento
const fadeInUp = {
  hidden: { opacity: 0, y: 20 } as AnimationState,
  visible: { opacity: 1, y: 0 } as AnimationState
};

// Animación solo fade
const fadeIn = {
  hidden: { opacity: 0 } as AnimationState,
  visible: { opacity: 1 } as AnimationState
};

// Sin animación
const noAnimation = {
  hidden: { opacity: 1 } as AnimationState,
  visible: { opacity: 1 } as AnimationState
};

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [buttonOpacity, setButtonOpacity] = useState(1);
  
  // Scroll handler optimizado con requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (heroRef.current) {
            const heroHeight = heroRef.current.offsetHeight;
            const scrollY = window.scrollY;
            const progress = Math.min(scrollY / (heroHeight * 0.5), 1);
            setButtonOpacity(1 - progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Variantes de animación condicionales - siempre retorna el mismo tipo
  const animFadeInUp = reduceMotion ? noAnimation : fadeInUp;
  const animFadeIn = reduceMotion ? noAnimation : fadeIn;

  return (
    <>
      {/* 1. HERO SECTION - Con CSS parallax optimizado */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image - CSS parallax en lugar de Framer Motion */}
        <div className="absolute inset-0 z-0 will-change-transform" style={{ transform: 'translateZ(-1px) scale(1.5)' }}>
          {/* Imagen de fondo */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
            style={{ backgroundImage: "url('/images/font-home.jpg')" }}
          />
          
          {/* Gradient overlay azul desde abajo izquierda */}
          <div className="absolute inset-0 bg-gradient-to-tr from-techmedis-primary via-techmedis-primary/75 to-techmedis-primary/30" />
          
          {/* Extra blur en la sección inferior */}
          <div className="absolute bottom-0 left-0 w-full h-4/5 bg-gradient-to-t from-techmedis-primary via-techmedis-secondary/85 to-transparent blur-3xl" />
          
          {/* Overlay adicional de color azul */}
          <div className="absolute inset-0 bg-techmedis-primary/40" />
          
          {/* Overlay oscuro sutil */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Column - Text */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={animFadeInUp.hidden}
                animate={animFadeInUp.visible}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white/90 text-sm font-medium">Líderes en Tecnología Médica</span>
              </motion.div>

              <motion.h1
                initial={animFadeInUp.hidden}
                animate={animFadeInUp.visible}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display text-white mb-6 leading-tight"
              >
                Equipamiento Médico de{" "}
                <span className="relative">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-white">
                    marcas líderes
                  </span>
                  <span className="absolute bottom-2 left-0 h-3 bg-white/20 -z-0 w-full" />
                </span>
              </motion.h1>

              <motion.p
                initial={animFadeInUp.hidden}
                animate={animFadeInUp.visible}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.15 }}
                className="text-lg sm:text-xl text-white/80 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                Proveemos equipos médicos y soluciones de imágenes de alta calidad
              </motion.p>

              <motion.div
                initial={animFadeInUp.hidden}
                animate={animFadeInUp.visible}
                transition={{ duration: 0.5, delay: reduceMotion ? 0 : 0.2 }}
                 className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center lg:justify-start items-stretch sm:items-center"
              >
                <div 
                  style={{ opacity: buttonOpacity }}
                   className="flex transition-opacity duration-100"
                >
                  <Link 
                    href="/contacto"
                     className="group flex items-center justify-center gap-2 bg-white text-techmedis-primary font-bold px-8 py-4 rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl flex-1 sm:flex-none"
                  >
                     <Phone className="w-5 h-5 flex-shrink-0" />
                     <span>Solicitar Asesoría</span>
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
                  </Link>
                </div>
                <button 
                  onClick={() => {
                    document.getElementById('catalogo-section')?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }}
                   className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all cursor-pointer flex-1 sm:flex-none"
                >
                  Ver Catálogo
                </button>
              </motion.div>
            </div>

            {/* Right Column - Feature Cards (solo desktop) */}
            <motion.div
              initial={reduceMotion ? {} : { opacity: 0, x: 30 }}
              animate={reduceMotion ? {} : { opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden lg:grid grid-cols-2 gap-4"
            >
              {/* Feature Card 1 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 col-span-2 hover:bg-white/15 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Stethoscope className="w-8 h-8 text-blue-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mb-1">Equipamiento Médico</h3>
                    <p className="text-white/70 text-sm">Tecnología de punta para diagnóstico y tratamiento en instituciones de salud.</p>
                  </div>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors duration-300">
                <div className="p-3 bg-emerald-500/20 rounded-xl w-fit mb-3">
                  <Heart className="w-6 h-6 text-emerald-300" />
                </div>
                <h3 className="text-white font-bold mb-1">Veterinario</h3>
                <p className="text-white/70 text-sm">Equipos especializados para el cuidado animal.</p>
              </div>

              {/* Feature Card 3 */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-colors duration-300">
                <div className="p-3 bg-amber-500/20 rounded-xl w-fit mb-3">
                  <Award className="w-6 h-6 text-amber-300" />
                </div>
                <h3 className="text-white font-bold mb-1">Certificados</h3>
                <p className="text-white/70 text-sm">Calidad garantizada con estándares internacionales.</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator - CSS animation en lugar de Framer Motion infinito */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-fade-in">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2 animate-bounce-slow">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="py-16 bg-white relative z-10 -mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={animFadeIn.hidden}
            whileInView={animFadeIn.visible}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center"
                >
                  <span className="block text-4xl md:text-5xl font-bold text-techmedis-primary mb-2">
                    {stat.number}
                  </span>
                  <span className="text-sm text-techmedis-text/70 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. CATEGORÍAS SECTION */}
      <section id="catalogo-section" className="py-20 md:py-28 bg-techmedis-light scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={animFadeIn.hidden}
            whileInView={animFadeIn.visible}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-techmedis-secondary font-semibold text-sm uppercase tracking-wider mb-4">
              Nuestro Catálogo
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-techmedis-primary mb-4">
              Equipamiento Especializado
            </h2>
            <p className="text-lg text-techmedis-text/80 max-w-2xl mx-auto">
              Soluciones tecnológicas diseñadas para cada necesidad médica y veterinaria
            </p>
          </motion.div>

          {/* Cards */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Card Clínico */}
            <motion.div 
              initial={animFadeInUp.hidden}
              whileInView={animFadeInUp.visible}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 flex-1"
            >
              <div className="aspect-[16/12] sm:aspect-[16/10] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514" 
                  alt="Equipamiento Médico" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-techmedis-primary/90 via-techmedis-primary/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Stethoscope className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">Instituciones de Salud</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
                  Equipamiento Médico
                </h3>
                <p className="text-white/80 mb-5 sm:mb-6 line-clamp-2 text-sm sm:text-base">
                  Tecnología avanzada para diagnóstico, monitoreo y tratamiento en hospitales y clínicas.
                </p>
                <Link 
                  href="/equipamientos-medicos"
                  className="inline-flex items-center gap-2 bg-white text-techmedis-primary font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-white/90 transition-all group/btn text-sm sm:text-base"
                >
                  Explorar Catálogo
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Card Veterinario */}
            <motion.div 
              initial={animFadeInUp.hidden}
              whileInView={animFadeInUp.visible}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.1 }}
              className="group relative overflow-hidden rounded-3xl bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 flex-1"
            >
              <div className="aspect-[16/12] sm:aspect-[16/10] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def" 
                  alt="Equipamiento Veterinario" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-600/90 via-teal-600/40 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">Centros Veterinarios</span>
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
                  Equipamiento Veterinario
                </h3>
                <p className="text-white/80 mb-5 sm:mb-6 line-clamp-2 text-sm sm:text-base">
                  Equipos especializados para el cuidado y diagnóstico animal de alta calidad.
                </p>
                <Link 
                  href="/equipamiento-veterinario"
                  className="inline-flex items-center gap-2 bg-white text-teal-600 font-semibold px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-white/90 transition-all group/btn text-sm sm:text-base"
                >
                  Explorar Catálogo
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. CÓMO TRABAJAMOS */}
      <HowWeWork />

      {/* 5. SERVICIOS */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={animFadeIn.hidden}
            whileInView={animFadeIn.visible}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-techmedis-secondary font-semibold text-sm uppercase tracking-wider mb-4">
              Nuestros Servicios
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-techmedis-primary mb-4">
              Acompañamiento Integral
            </h2>
            <p className="text-lg text-techmedis-text/80 max-w-2xl mx-auto">
              Más que proveedores, somos socios estratégicos en su operación
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={animFadeInUp.hidden}
                whileInView={animFadeInUp.visible}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.3, delay: reduceMotion ? 0 : index * 0.05 }}
                className="group bg-techmedis-light rounded-2xl p-8 hover:bg-techmedis-primary transition-colors duration-300 cursor-pointer"
              >
                <div className="text-techmedis-primary group-hover:text-white mb-6 transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-lg font-bold text-techmedis-primary group-hover:text-white mb-3 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-sm text-techmedis-text/70 group-hover:text-white/80 leading-relaxed transition-colors duration-300">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA FINAL */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-techmedis-primary via-techmedis-secondary to-techmedis-primary relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={animFadeIn.hidden}
            whileInView={animFadeIn.visible}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display text-white mb-6">
              ¿Listo para modernizar su institución?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Nuestro equipo de expertos está listo para asesorarlo y encontrar la solución perfecta para sus necesidades.
            </p>
             <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-stretch sm:items-center">
              <CTAButton variant="outline" to="/contacto">
                <span className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contactar Ahora
                </span>
              </CTAButton>
              <CTAButton variant="secondary" to="/sobre-nosotros">
                Conocer Más
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
