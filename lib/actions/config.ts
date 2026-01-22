"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// ==================== GET CONFIG ====================
export async function getConfig(key: string): Promise<string | null> {
  try {
    const config = await (prisma as any).config.findUnique({
      where: { key },
    });
    return config?.value || null;
  } catch (error) {
    console.error("Error getting config:", error);
    return null;
  }
}

// ==================== GET ALL CONFIGS ====================
export async function getAllConfigs(): Promise<Record<string, string>> {
  try {
    const configs = await (prisma as any).config.findMany();
    return configs.reduce((acc: Record<string, string>, config: any) => {
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
    await (prisma as any).config.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    revalidatePath("/admin");
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
export async function getWhatsAppNumber(): Promise<string> {
  const number = await getConfig("whatsapp_number");
  return number || "5491112345678";
}
