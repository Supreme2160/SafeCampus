import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authHandler } from "@/lib/authHandler";
import prisma from "@/lib/prismaSingleton";
import { PrivatePage } from "@/components/dashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authHandler);

  if (!session?.user) {
    return <PrivatePage />;
  }

  // Get user data to determine their role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return <PrivatePage />;
  }

  // Redirect based on user type
  switch (user.userType) {
    case "STUDENT":
      redirect("/Dashboard/student");
    case "TEACHER":
      redirect("/Dashboard/teacher");
    case "ADMIN":
      redirect("/Dashboard/admin");
    default:
      redirect("/");
  }
}
