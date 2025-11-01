import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authHandler } from "@/lib/authHandler";
import prisma from "@/lib/prismaSingleton";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardHeader, StatsCard } from "@/components/dashboard";

async function getStudentData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      student: {
        include: {
          gamesScores: {
            orderBy: { playedAt: "desc" },
            take: 10,
          },
          modulesCompleted: {
            include: {
              lessons: true,
            },
          },
        },
      },
    },
  });

  return user;
}

export default async function StudentDashboard() {
  const session = await getServerSession(authHandler);

  if (!session?.user) {
    redirect("/signin");
  }

  const userData = await getStudentData(session.user.id);

  if (!userData || userData.userType !== "STUDENT") {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground mt-2">
          You need to be a student to access this dashboard.
        </p>
      </div>
    );
  }

  const student = userData.student;
  const totalGames = student?.gamesPlayed || 0;
  const totalModules = student?.modulesCompleted.length || 0;
  const recentScores = student?.gamesScores || [];
  const averageScore =
    recentScores.length > 0
      ? Math.round(
          recentScores.reduce((sum, score) => sum + score.score, 0) /
            recentScores.length
        ) / 100
      : 0;

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Student Dashboard"
        roleLabel="Student"
        subtitle={`Welcome back, ${userData.name || userData.username}! Stay prepared and keep practicing your safety skills.`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Games Played"
          value={totalGames}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          }
        />
        <StatsCard
          title="Average Score"
          value={`${averageScore}`}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <div className="rounded-2xl p-px bg-linear-to-br from-indigo-400/30 to-purple-400/20 dark:from-indigo-400/30 dark:to-purple-400/20 shadow-lg">
          <div className="bg-white dark:bg-slate-900 rounded-[15px] p-6 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-2">Progress</p>
                <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">{averageScore}%</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/15 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <Progress value={averageScore} max={10} className="mt-2 h-2.5 bg-slate-200 dark:bg-slate-700/50" />
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-3">
              {averageScore >= 7 ? "🎉 Great performance!" : "Keep practicing!"}
            </p>
          </div>
        </div>
        <StatsCard
          title="Modules Completed"
          value={totalModules}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
      </div>

      {/* Performance Summary & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Performance</CardTitle>
            <CardDescription>Your latest game results</CardDescription>
          </CardHeader>
          <CardContent>
            {recentScores.slice(0, 5).length > 0 ? (
              <div className="space-y-3">
                {recentScores.slice(0, 5).map((score) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {score.gameName.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(score.playedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`font-bold text-lg ${
                          score.score >= 70
                            ? "text-green-500"
                            : score.score >= 50
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {score.score}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No performance data yet. Start playing!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump right into learning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/games"
              className="flex items-center gap-3 bg-primary text-primary-foreground rounded-md px-4 py-3 hover:bg-primary/90 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-left">
                <div className="font-medium">Play Games</div>
                <div className="text-xs opacity-90">
                  Practice with interactive scenarios
                </div>
              </div>
            </Link>
            <Link
              href="/modules"
              className="flex items-center gap-3 bg-blue-500 text-white rounded-md px-4 py-3 hover:bg-blue-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
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
              <div className="text-left">
                <div className="font-medium">Browse Modules</div>
                <div className="text-xs opacity-90">
                  Learn safety procedures
                </div>
              </div>
            </Link>
            <Link
              href="/faq"
              className="flex items-center gap-3 bg-green-500 text-white rounded-md px-4 py-3 hover:bg-green-600 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-left">
                <div className="font-medium">Get Help</div>
                <div className="text-xs opacity-90">FAQs and support</div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Game Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Game Scores</CardTitle>
          <CardDescription>Track your gaming performance</CardDescription>
        </CardHeader>
        <CardContent>
          {recentScores.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Game</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentScores.map((score) => (
                  <TableRow key={score.id}>
                    <TableCell className="font-medium">
                      {score.gameName.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{score.gameType}</Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-semibold ${
                          score.score >= 70
                            ? "text-green-500"
                            : score.score >= 50
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {score.score}%
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(score.playedAt).toLocaleDateString()}
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-muted-foreground">
                No game scores yet. Start playing to see your progress!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completed Modules */}
      <Card>
        <CardHeader>
          <CardTitle>Completed Modules</CardTitle>
          <CardDescription>Your learning achievements</CardDescription>
        </CardHeader>
        <CardContent>
          {student?.modulesCompleted && student.modulesCompleted.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {student.modulesCompleted.map((module) => (
                <div
                  key={module.id}
                  className="border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{module.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {module.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      ✓ Done
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <svg
                      className="w-4 h-4"
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
                    <span>{module.lessons.length} lessons</span>
                    <span>•</span>
                    <span>{module.duration || 20} min</span>
                  </div>
                </div>
              ))}
            </div>
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
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <p className="text-muted-foreground mb-4">
                No modules completed yet. Start learning today!
              </p>
              <Link
                href="/modules"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-md px-4 py-2 hover:bg-primary/90 transition-colors"
              >
                Browse Modules
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
