"use client";

import Link from "next/link";
import { ReactNode } from "react";

interface CTAButtonProps {
  variant?: "primary" | "secondary" | "outline";
  to?: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
}

export function CTAButton({ 
  variant = "primary", 
  to, 
  onClick, 
  children, 
  className = "" 
}: CTAButtonProps) {
  const variants: Record<string, string> = {
    primary: "bg-techmedis-primary hover:bg-techmedis-primary/90 text-white",
    secondary: "bg-transparent border-2 border-techmedis-primary text-white hover:bg-techmedis-light hover:text-techmedis-primary",
    outline: "bg-white border-2 border-white text-techmedis-primary hover:bg-white/90",
  };

  const selectedVariant = variants[variant] || variants.primary;

  const buttonClasses = `${selectedVariant} px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer inline-flex items-center justify-center gap-2 ${className}`;

  const content = (
    <button
      className={buttonClasses}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );

  if (to) {
    return <Link href={to}>{content}</Link>;
  }

  return content;
}
