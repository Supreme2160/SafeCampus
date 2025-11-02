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
import { DashboardHeader } from "@/components/dashboard";
import { PerformanceTrendChart } from "@/components/dashboard/PerformanceTrendChart";
import { GameScoresChart } from "@/components/dashboard/GameScoresChart";

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
        ) 
      : 0;

  // Get all modules for progress calculation
  const allModules = await prisma.modules.count();

  // Prepare chart data
  const performanceTrend = recentScores
    .slice(0, 10)
    .reverse()
    .map((score) => ({
      date: new Date(score.playedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      score: score.score,
    }));

  const gameScoresData = recentScores
    .slice(0, 5)
    .map((score) => ({
      game: score.gameName.replace(/_/g, ' ').substring(0, 15),
      score: score.score,
    }));

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-[hsl(var(--chart-1))]/5">
      <div className="space-y-6 p-4 md:p-6">
      <DashboardHeader
        title="Student Dashboard"
        roleLabel="Student"
        subtitle={`Welcome back, ${userData.name || userData.username}! Stay prepared and keep practicing your safety skills.`}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-l-4 border-l-[hsl(var(--chart-1))] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Games Played</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-br from-[hsl(var(--chart-1))] to-blue-600 bg-clip-text text-transparent">
                    {totalGames}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">Total sessions</p>
              </div>
              <div className="p-3 rounded-lg bg-[hsl(var(--chart-1))]/10">
                <svg className="w-6 h-6 text-[hsl(var(--chart-1))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(var(--chart-2))] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-br from-[hsl(var(--chart-2))] to-green-600 bg-clip-text text-transparent">
                    {averageScore}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">across all games</p>
              </div>
              <div className="p-3 rounded-lg bg-[hsl(var(--chart-2))]/10">
                <svg className="w-6 h-6 text-[hsl(var(--chart-2))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(var(--chart-3))] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Modules</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-br from-[hsl(var(--chart-3))] to-yellow-600 bg-clip-text text-transparent">
                    {totalModules}
                  </h2>
                  <span className="text-sm text-muted-foreground">/ {allModules}</span>
                </div>
                <p className="text-xs text-muted-foreground">completed</p>
              </div>
              <div className="p-3 rounded-lg bg-[hsl(var(--chart-3))]/10">
                <svg className="w-6 h-6 text-[hsl(var(--chart-3))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(var(--chart-4))] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Progress</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-br from-[hsl(var(--chart-4))] to-purple-600 bg-clip-text text-transparent">
                    {Math.round((totalModules / allModules) * 100)}%
                  </h2>
                </div>
                <Progress value={(totalModules / allModules) * 100} className="mt-2 h-2" />
              </div>
              <div className="p-3 rounded-lg bg-[hsl(var(--chart-4))]/10">
                <svg className="w-6 h-6 text-[hsl(var(--chart-4))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Performance Trend */}
        {performanceTrend.length > 0 && (
          <Card className="shadow-sm hover:shadow-md transition-shadow border-t-2 border-t-[hsl(var(--chart-1))]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <div className="w-1 h-6 bg-[hsl(var(--chart-1))] rounded-full"></div>
                    Performance Trend
                  </CardTitle>
                  <CardDescription className="mt-1">Your score progression over time</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-[hsl(var(--chart-1))]/10 text-[hsl(var(--chart-1))] border-[hsl(var(--chart-1))]/20">
                  Last 10 Games
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <PerformanceTrendChart data={performanceTrend} />
            </CardContent>
          </Card>
        )}

        {/* Game Scores */}
        {gameScoresData.length > 0 && (
          <Card className="shadow-sm hover:shadow-md transition-shadow border-t-2 border-t-[hsl(var(--chart-2))]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <div className="w-1 h-6 bg-[hsl(var(--chart-2))] rounded-full"></div>
                    Game Scores
                  </CardTitle>
                  <CardDescription className="mt-1">Recent game performance breakdown</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-[hsl(var(--chart-2))]/10 text-[hsl(var(--chart-2))] border-[hsl(var(--chart-2))]/20">
                  Top 5
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <GameScoresChart data={gameScoresData} />
            </CardContent>
          </Card>
        )}

      {/* Quick Actions */}
      <Card className="shadow-sm hover:shadow-md transition-shadow border-t-2 border-t-[hsl(var(--chart-5))]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <div className="w-1 h-6 bg-[hsl(var(--chart-5))] rounded-full"></div>
                Quick Actions
              </CardTitle>
              <CardDescription className="mt-1">Jump right into learning</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link
              href="/games"
              className="flex flex-col items-center gap-3 bg-[hsl(var(--chart-1))] text-white rounded-lg p-6 hover:shadow-lg transition-all group"
            >
              <div className="p-4 rounded-full bg-white/20 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">Play Games</div>
                <div className="text-sm opacity-90 mt-1">Interactive scenarios</div>
              </div>
            </Link>
            <Link
              href="/modules"
              className="flex flex-col items-center gap-3 bg-[hsl(var(--chart-2))] text-white rounded-lg p-6 hover:shadow-lg transition-all group"
            >
              <div className="p-4 rounded-full bg-white/20 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">Learn Modules</div>
                <div className="text-sm opacity-90 mt-1">Safety procedures</div>
              </div>
            </Link>
            <Link
              href="/faq"
              className="flex flex-col items-center gap-3 bg-[hsl(var(--chart-3))] text-white rounded-lg p-6 hover:shadow-lg transition-all group"
            >
              <div className="p-4 rounded-full bg-white/20 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">Get Help</div>
                <div className="text-sm opacity-90 mt-1">FAQs & support</div>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Completed Modules */}
      <Card className="shadow-sm hover:shadow-md transition-shadow border-t-2 border-t-[hsl(var(--chart-2))]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <div className="w-1 h-6 bg-[hsl(var(--chart-2))] rounded-full"></div>
                Completed Modules
              </CardTitle>
              <CardDescription className="mt-1">Your learning achievements</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-[hsl(var(--chart-2))]/10 text-[hsl(var(--chart-2))] border-[hsl(var(--chart-2))]/20">
              {totalModules} Modules
            </Badge>
          </div>
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
    </div>
    </div>
  );
};
