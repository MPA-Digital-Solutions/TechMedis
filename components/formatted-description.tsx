"use client";

import { ReactNode } from "react";

interface FormattedDescriptionProps {
  text: string;
  className?: string;
}

/**
 * Componente que formatea descripciones de productos
 * Soporta:
 * - Líneas que comienzan con "- " se muestran como puntos de lista
 * - Saltos de línea se respetan
 * - Espacios múltiples y tabulaciones se preservan
 * - Párrafos separados por líneas en blanco
 */
export function FormattedDescription({ text, className = "" }: FormattedDescriptionProps) {
  // Dividir por líneas
  const lines = text.split("\n").map((line) => line.trimEnd());

  // Procesar líneas
  const elements: (string | ReactNode)[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Línea vacía - agregar espacio
    if (!line.trim()) {
      elements.push("\n");
      i++;
      continue;
    }

    // Línea con viñeta (- )
    if (line.trim().startsWith("- ")) {
      const bulletText = line.trim().substring(2).trim();
      elements.push(
        <div key={`bullet-${i}`} className="flex gap-3 ml-0 mt-2">
          <span className="text-techmedis-primary font-bold min-w-fit pt-0.5">•</span>
          <span className="text-techmedis-text">{bulletText}</span>
        </div>
      );
      i++;
      continue;
    }

    // Línea con número (1. 2. etc)
    if (/^\d+\.\s/.test(line.trim())) {
      const match = line.trim().match(/^(\d+\.\s)(.+)$/);
      if (match) {
        const numberPart = match[1];
        const textPart = match[2];
        elements.push(
          <div key={`number-${i}`} className="flex gap-3 ml-0 mt-2">
            <span className="text-techmedis-primary font-bold min-w-fit">{numberPart}</span>
            <span className="text-techmedis-text">{textPart}</span>
          </div>
        );
        i++;
        continue;
      }
    }

    // Línea normal - párrafo
    // Recolectar líneas consecutivas que no son especiales
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("- ") &&
      !/^\d+\.\s/.test(lines[i].trim())
    ) {
      paragraphLines.push(lines[i]);
      i++;
    }

    if (paragraphLines.length > 0) {
      const paragraphText = paragraphLines.join(" ").trim();
      elements.push(
        <p key={`para-${i}`} className="text-techmedis-text leading-relaxed mt-2">
          {paragraphText}
        </p>
      );
    }
  }

  return (
    <div className={`space-y-0 ${className}`}>
      {elements.map((element, index) => (
        typeof element === "string" ? (
          element === "\n" ? (
            <div key={`spacing-${index}`} className="h-2" />
          ) : (
            element
          )
        ) : (
          element
        )
      ))}
    </div>
  );
}
