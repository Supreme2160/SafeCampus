import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authHandler } from "@/lib/authHandler";
import prisma from "@/lib/prismaSingleton";

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          System overview and management
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Users
              </p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalUsers}</h3>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Students
              </p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalStudents}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-500"
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
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Teachers
              </p>
              <h3 className="text-3xl font-bold mt-2">{stats.totalTeachers}</h3>
            </div>
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Games Played
              </p>
              <h3 className="text-3xl font-bold mt-2">
                {stats.totalGamesPlayed}
              </h3>
            </div>
            <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-500"
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
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Content Statistics</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded">
              <span className="text-muted-foreground">Learning Modules</span>
              <span className="font-bold text-lg">{stats.totalModules}</span>
            </div>
            <div className="flex items-center justify-between p-3 border rounded">
              <span className="text-muted-foreground">Quizzes</span>
              <span className="font-bold text-lg">{stats.totalQuizzes}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">User Distribution</h2>
          </div>
          <div className="space-y-4">
            {stats.usersByType.map((type) => (
              <div
                key={type.userType}
                className="flex items-center justify-between p-3 border rounded"
              >
                <span className="text-muted-foreground capitalize">
                  {type.userType.toLowerCase()}s
                </span>
                <span className="font-bold text-lg">{type._count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Statistics */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Game Statistics</h2>
        {stats.gameStats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Game
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Times Played
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Average Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.gameStats.map((game) => (
                  <tr key={game.gameName} className="border-b last:border-0">
                    <td className="py-3 px-4 font-medium">
                      {game.gameName.replace(/_/g, " ")}
                    </td>
                    <td className="py-3 px-4">{game._count}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-green-500">
                        {Math.round(game._avg.score || 0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No game statistics available yet.
          </p>
        )}
      </div>

      {/* Recent Users */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Users</h2>
        {stats.recentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentUsers.map((user) => (
                  <tr key={user.id} className="border-b last:border-0">
                    <td className="py-3 px-4 font-medium">
                      {user.name || user.username}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.userType === "ADMIN"
                            ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            : user.userType === "TEACHER"
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        }`}
                      >
                        {user.userType}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No users found.
          </p>
        )}
      </div>
    </div>
  );
}
