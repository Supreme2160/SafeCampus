import prisma from "@/lib/prismaSingleton";

export default async function fetchModule(id: string) {
    const moduleX = await prisma.modules.findUnique({
        where: {
            id: id,
        },
        include: {
            lessons: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    return moduleX;
}
