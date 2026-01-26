"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { z } from "zod";

type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};

// Validation schema
const createClientSchema = z.object({
  name: z.string().min(1, "El nombre es requerido").max(255),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().max(50).optional().or(z.literal("")),
  company: z.string().max(255).optional().or(z.literal("")),
  message: z.string().min(1, "El mensaje es requerido"),
  source: z.string().default("contact_form"),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;

// ==================== CREATE CLIENT ====================
export async function createClient(
  data: CreateClientInput
): Promise<ActionResponse<{ id: string }>> {
  try {
    const validated = createClientSchema.parse(data);

    const client = await (prisma as any).client.create({
      data: {
        name: validated.name,
        email: validated.email || null,
        phone: validated.phone || null,
        company: validated.company || null,
        message: validated.message,
        source: validated.source,
        status: "pending",
      },
    });

    revalidatePath("/admin");
    return { success: true, data: { id: client.id } };
  } catch (error) {
    console.error("Error creating client:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al guardar el contacto" };
  }
}

// ==================== GET CLIENTS ====================
interface ClientFilters {
  status?: string;
  source?: string;
  limit?: number;
  offset?: number;
}

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  message: string;
  source: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getClients(filters?: ClientFilters): Promise<Client[]> {
  try {
    const where: Record<string, string> = {};
    
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.source) {
      where.source = filters.source;
    }

    // OPTIMIZADO: Paginación por defecto 50 items para reducir consumo de memoria
    const clients = await (prisma as any).client.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: filters?.limit ?? 50,
      skip: filters?.offset ?? 0,
    });

    return clients;
  } catch (error) {
    console.error("Error getting clients:", error);
    return [];
  }
}

// ==================== UPDATE CLIENT STATUS ====================
export async function updateClientStatus(
  id: string,
  status: string
): Promise<ActionResponse> {
  try {
    await (prisma as any).client.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Error updating client status:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Error al actualizar el estado" };
  }
}
