"use server";

// NOTA: revalidatePath REMOVIDO para optimización de procesos
// Los cambios se reflejarán con ISR (cada 24 horas) o manualmente via /api/revalidate
import prisma from "@/lib/prisma";

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Timeout para queries de BD (10 segundos)
const QUERY_TIMEOUT = 10000;

// Helper para ejecutar queries con timeout
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Query timeout")), ms);
  });
  return Promise.race([promise, timeout]);
}

// ==================== GET CONFIG ====================
export async function getConfig(key: string): Promise<string | null> {
  try {
    const config = await withTimeout<{ value: string } | null>(
      (prisma as any).config.findUnique({
        where: { key },
      }),
      QUERY_TIMEOUT
    );
    return config?.value || null;
  } catch (error) {
    console.error("Error getting config:", error);
    return null;
  }
}

// ==================== GET ALL CONFIGS ====================
export async function getAllConfigs(): Promise<Record<string, string>> {
  try {
    const configs = await withTimeout<Array<{ key: string; value: string }>>(
      (prisma as any).config.findMany(),
      QUERY_TIMEOUT
    );
    return configs.reduce((acc: Record<string, string>, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Error getting all configs:", error);
    return {};
  }
}

// ==================== SET CONFIG ====================
export async function setConfig(
  key: string,
  value: string
): Promise<ActionResponse> {
  try {
    await withTimeout(
      (prisma as any).config.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
      QUERY_TIMEOUT
    );

    // ISR se encarga de la revalidación cada 24 horas
    // Para forzar actualización inmediata usar /api/revalidate
    return { success: true };
  } catch (error) {
    console.error("Error setting config:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al guardar la configuración" };
  }
}

// ==================== GET WHATSAPP NUMBER ====================
// Retorna valor por defecto si hay error de BD
export async function getWhatsAppNumber(): Promise<string> {
  const number = await getConfig("whatsapp_number");
  return number || "5491112345678";
}
