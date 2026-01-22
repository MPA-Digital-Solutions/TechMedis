import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// Rutas que deben ser revalidadas cuando cambian los productos
const PRODUCT_PATHS = [
  "/",
  "/equipamientos-clinicos",
  "/equipamiento-veterinario",
];

// API para revalidar el caché manualmente
// Se puede llamar desde el admin o mediante webhook
export async function POST(request: NextRequest) {
  try {
    // Verificar token de seguridad (opcional pero recomendado)
    const authHeader = request.headers.get("authorization");
    const token = process.env.REVALIDATE_TOKEN;
    
    // Si hay token configurado, verificarlo
    if (token && authHeader !== `Bearer ${token}`) {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { path, slug } = body as { path?: string; slug?: string };

    // Si se especifica una ruta, revalidar solo esa
    if (path) {
      revalidatePath(path);
      return NextResponse.json({ 
        success: true, 
        revalidated: [path],
        timestamp: new Date().toISOString()
      });
    }

    // Si se especifica un slug de producto, revalidar página del producto
    if (slug) {
      const productPath = `/productos/${slug}`;
      revalidatePath(productPath);
      
      // También revalidar catálogos
      PRODUCT_PATHS.forEach((p) => revalidatePath(p));
      
      return NextResponse.json({ 
        success: true, 
        revalidated: [productPath, ...PRODUCT_PATHS],
        timestamp: new Date().toISOString()
      });
    }

    // Por defecto, revalidar todas las rutas de productos
    PRODUCT_PATHS.forEach((p) => revalidatePath(p));
    
    return NextResponse.json({ 
      success: true, 
      revalidated: PRODUCT_PATHS,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error revalidating:", error);
    return NextResponse.json(
      { success: false, error: "Error al revalidar" },
      { status: 500 }
    );
  }
}

// GET para verificar que la API funciona
export async function GET() {
  return NextResponse.json({ 
    status: "ok",
    message: "API de revalidación activa",
    paths: PRODUCT_PATHS
  });
}
