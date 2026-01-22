import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Crear Prisma Client con configuración optimizada
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

// IMPORTANTE: Usar singleton en TODOS los entornos para evitar múltiples conexiones
// Esto es crítico para hosting compartido como Hostinger
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Guardar referencia global en TODOS los entornos (no solo development)
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
