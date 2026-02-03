import { initializeSubcategories } from "@/lib/actions/subcategories";

export async function GET() {
  try {
    const result = await initializeSubcategories();
    
    if (result.success) {
      return Response.json(
        { message: "Subcategorías inicializadas exitosamente" },
        { status: 200 }
      );
    } else {
      return Response.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return Response.json(
      { error: "Error al inicializar subcategorías" },
      { status: 500 }
    );
  }
}
