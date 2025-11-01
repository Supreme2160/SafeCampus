"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

interface DashboardNavProps {
  displayName?: string | null;
}

const links = [
  { href: "/dashboard/student", label: "Student Dashboard" },
  { href: "/dashboard/teacher", label: "Teacher Dashboard" },
  { href: "/dashboard/admin", label: "Admin Dashboard" },
];

export function DashboardNav({ displayName }: DashboardNavProps) {
  const pathname = usePathname();

  return (
  <nav className="border-b bg-card/90 backdrop-blur supports-backdrop-filter:bg-card/80">
      <div className="relative">
        {/* subtle top gradient underline */}
        <div className="absolute inset-x-0 -top-px h-px bg-linear-to-r from-blue-600/50 via-indigo-600/50 to-purple-600/50" />
      </div>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-linear-to-br from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center shadow-md shadow-blue-500/20">
                SC
              </div>
              <span className="text-lg md:text-xl font-bold">SafeCampus</span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {links.map((l) => {
                const active = pathname?.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`text-sm font-medium px-3 py-2 rounded-md transition-colors ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {displayName && (
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {displayName}
              </span>
            )}
            <Link href="/api/auth/signout">
              <Button variant="ghost" className="text-destructive hover:text-destructive">
                Sign Out
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
