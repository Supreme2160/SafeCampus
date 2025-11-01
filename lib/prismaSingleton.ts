import { PrismaClient } from "@prisma/client";

const prismaSingleton = (): PrismaClient => {
    return new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
    });
}

declare global {
    var prisma: ReturnType<typeof prismaSingleton> | undefined
}

const prisma: PrismaClient = globalThis.prisma ?? prismaSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
    global.prisma = prisma;
}

