import { getServerSession } from "next-auth";
import { authHandler } from "@/lib/authHandler";
import { PrivatePage } from "@/components/dashboard";
import { DashboardNav } from "@/components/dashboard/DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authHandler);

  if (!session) {
    return <PrivatePage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav displayName={session.user?.name || session.user?.email} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
