import prisma from "@/lib/prismaSingleton";

export default async function fetchModules() {
    const modules = await prisma.modules.findMany({
        where: {
            published: true,
        },
        select: {
            id: true,
            title: true,
            description: true,
            coverImage: true,
            duration: true,
            level: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return modules;
}