import Image from "next/image";
import { ComponentProps } from "react";

type ImageProps = ComponentProps<typeof Image>;

/**
 * Wrapper sobre Next.js Image que maneja correctamente imágenes de /uploads
 * En producción, las imágenes se sirven directamente sin optimización
 */
export function OptimizedImage(props: ImageProps) {
  // Si la imagen está en /uploads, servir directamente sin optimización
  if (typeof props.src === "string" && props.src.startsWith("/uploads")) {
    return (
      <Image
        {...props}
        unoptimized={process.env.NODE_ENV === "production"}
      />
    );
  }

  // Para otras imágenes, usar optimización normal
  return <Image {...props} />;
}
