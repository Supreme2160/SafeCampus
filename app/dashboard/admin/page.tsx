import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authHandler } from "@/lib/authHandler";
import prisma from "@/lib/prismaSingleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardHeader, StatsCard } from "@/components/dashboard";

async function getAdminStats() {
  const totalUsers = await prisma.user.count();
  const totalStudents = await prisma.student.count();
  const totalTeachers = await prisma.teacher.count();
  const totalModules = await prisma.modules.count();
  const totalQuizzes = await prisma.quiz.count();
  const totalGamesPlayed = await prisma.gameScore.count();

  const usersByType = await prisma.user.groupBy({
    by: ["userType"],
    _count: true,
  });

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      userType: true,
      createdAt: true,
    },
  });

  const gameStats = await prisma.gameScore.groupBy({
    by: ["gameName"],
    _count: true,
    _avg: {
      score: true,
    },
  });

  return {
    totalUsers,
    totalStudents,
    totalTeachers,
    totalModules,
    totalQuizzes,
    totalGamesPlayed,
    usersByType,
    recentUsers,
    gameStats,
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authHandler);

  if (!session?.user) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.userType !== "ADMIN") {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground mt-2">
          You need to be an admin to access this dashboard.
        </p>
      </div>
    );
  }

  const stats = await getAdminStats();

  const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Admin Dashboard"
        roleLabel="Admin"
        subtitle="System overview and management for the SafeCampus platform."
      />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Students"
          value={stats.totalStudents}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatsCard
          title="Teachers"
          value={stats.totalTeachers}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatsCard
          title="Games Played"
          value={stats.totalGamesPlayed}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          }
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown by user type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.usersByType.map((type, index) => (
              <div
                key={type.userType}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="font-medium capitalize">
                    {type.userType.toLowerCase()}s
                  </span>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {type._count}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Content Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Content Statistics</CardTitle>
            <CardDescription>Available learning resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <span className="font-medium">Learning Modules</span>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {stats.totalModules}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                </div>
                <span className="font-medium">Quizzes</span>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {stats.totalQuizzes}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Game Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Game Statistics</CardTitle>
          <CardDescription>Performance metrics by game type</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.gameStats.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game</TableHead>
                  <TableHead className="text-center">Times Played</TableHead>
                  <TableHead className="text-center">Average Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.gameStats.map((game) => (
                  <TableRow key={game.gameName}>
                    <TableCell className="font-medium">
                      {game.gameName.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{game._count}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`font-semibold ${
                          Math.round(game._avg.score || 0) >= 70
                            ? "text-green-500"
                            : Math.round(game._avg.score || 0) >= 50
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {Math.round(game._avg.score || 0)}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                />
              </svg>
              <p className="text-muted-foreground">
                No game statistics available yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
          <CardDescription>Latest user registrations</CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentUsers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name || user.username}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.userType === "ADMIN"
                            ? "destructive"
                            : user.userType === "TEACHER"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {user.userType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <svg
                className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-muted-foreground">No users found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
