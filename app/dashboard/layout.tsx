import { getServerSession } from "next-auth";
import Link from "next/link";
import { authHandler } from "@/lib/authHandler";
import { PrivatePage } from "@/components/dashboard";

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
      <nav className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold">
                SafeCampus
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link
                  href="/Dashboard/student"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Student Dashboard
                </Link>
                <Link
                  href="/Dashboard/teacher"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Teacher Dashboard
                </Link>
                <Link
                  href="/Dashboard/admin"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Admin Dashboard
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {session.user?.name || session.user?.email}
              </span>
              <Link
                href="/api/auth/signout"
                className="text-sm font-medium text-destructive hover:underline"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
