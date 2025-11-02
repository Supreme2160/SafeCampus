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
import { DashboardHeader } from "@/components/dashboard";
import { EngagementChart } from "@/components/dashboard/EngagementChart";
import { ModuleChart } from "@/components/dashboard/ModuleChart";
import { GameDistributionChart } from "@/components/dashboard/GameDistributionChart";

async function getTeacherData(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      teacher: true,
    },
  });

  return user;
}

async function getStudentStats() {
  const totalStudents = await prisma.student.count();
  const students = await prisma.student.findMany({
    include: {
      user: {
        select: {
          name: true,
          username: true,
          email: true,
        },
      },
      gamesScores: {
        orderBy: { playedAt: "desc" },
      },
      modulesCompleted: true,
    },
    take: 10,
    orderBy: {
      gamesPlayed: "desc",
    },
  });

  return { totalStudents, students };
}

async function getRecentActivity() {
  const recentScores = await prisma.gameScore.findMany({
    include: {
      student: {
        include: {
          user: {
            select: {
              name: true,
              username: true,
            },
          },
        },
      },
    },
    orderBy: {
      playedAt: "desc",
    },
    take: 10,
  });

  return recentScores;
}

async function getAnalyticsData() {
  try {
    // Get overall statistics
    const totalStudents = await prisma.student.count();

    // Get student engagement over time (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const students = await prisma.student.findMany({
      include: {
        gamesScores: {
          where: {
            playedAt: {
              gte: twelveMonthsAgo,
            },
          },
        },
        modulesCompleted: true,
      },
    });

    // Calculate monthly active users
    const monthlyData: Record<string, { activeUsers: Set<string>; gamesPlayed: number }> = {};
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = date.toLocaleString('default', { month: 'short' });
      monthlyData[key] = { activeUsers: new Set<string>(), gamesPlayed: 0 };
    }

    students.forEach(student => {
      student.gamesScores.forEach(score => {
        const date = new Date(score.playedAt);
        const key = date.toLocaleString('default', { month: 'short' });
        if (monthlyData[key]) {
          monthlyData[key].activeUsers.add(student.id);
          monthlyData[key].gamesPlayed++;
        }
      });
    });

    const engagementData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      activeUsers: data.activeUsers.size,
    }));

    // Module completion stats
    const moduleStats = await prisma.modules.findMany({
      include: {
        completedBy: true,
      },
    });

    const moduleCompletionData = moduleStats
      .map(module => ({
        module: module.title.length > 15 ? module.title.substring(0, 15) + '...' : module.title,
        completions: module.completedBy.length,
      }))
      .sort((a, b) => b.completions - a.completions)
      .slice(0, 8);

    // Game type distribution
    const allGameScores = await prisma.gameScore.findMany({
      select: {
        gameName: true,
      },
    });

    const gameDistribution: Record<string, number> = {};
    allGameScores.forEach(score => {
      const name = score.gameName.replace(/_/g, ' ');
      gameDistribution[name] = (gameDistribution[name] || 0) + 1;
    });

    const gameTypeData = Object.entries(gameDistribution).map(([name, value]) => ({
      name,
      value,
    }));

    // Calculate metrics
    const currentMonth = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const currentMonthStudents = await prisma.student.count({
      where: {
        enrolledAt: {
          gte: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
        },
      },
    });

    const lastMonthStudents = await prisma.student.count({
      where: {
        enrolledAt: {
          gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          lt: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
        },
      },
    });

    const studentGrowthPercent = lastMonthStudents > 0 
      ? Math.round(((currentMonthStudents - lastMonthStudents) / lastMonthStudents) * 100)
      : 0;

    const totalGamesPlayed = allGameScores.length;

    return {
      overview: {
        totalStudents,
        totalGamesPlayed,
        studentGrowthPercent,
      },
      engagementData,
      moduleCompletionData,
      gameTypeData,
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return {
      overview: {
        totalStudents: 0,
        totalGamesPlayed: 0,
        studentGrowthPercent: 0,
      },
      engagementData: [],
      moduleCompletionData: [],
      gameTypeData: [],
    };
  }
}

export default async function TeacherDashboard() {
  const session = await getServerSession(authHandler);

  if (!session?.user) {
    redirect("/signin");
  }

  const userData = await getTeacherData(session.user.id);

  if (!userData || userData.userType !== "TEACHER") {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground mt-2">
          You need to be a teacher to access this dashboard.
        </p>
      </div>
    );
  }

  const { students } = await getStudentStats();
  const recentActivity = await getRecentActivity();
  const analytics = await getAnalyticsData();


  const totalModulesCompleted = students.reduce(
    (sum, student) => sum + student.modulesCompleted.length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-[hsl(var(--chart-1))]/5">
      <div className="space-y-6 p-4 md:p-6">
        <DashboardHeader
          title="Teacher Dashboard"
          roleLabel="Teacher"
          subtitle="Manage classes, track progress, and guide students through safety training."
        />

      {/* Stats Grid - Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="border-l-4 border-l-[hsl(var(--chart-1))] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-[hsl(var(--chart-1))] to-blue-600 bg-clip-text text-transparent">
                    {analytics.overview.totalStudents.toLocaleString()}
                  </h2>
                  {analytics.overview.studentGrowthPercent !== 0 && (
                    <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                      analytics.overview.studentGrowthPercent > 0 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {analytics.overview.studentGrowthPercent > 0 ? '+' : ''}{analytics.overview.studentGrowthPercent}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">vs previous month</p>
              </div>
              <div className="p-3 rounded-lg bg-[hsl(var(--chart-1))]/10">
                <svg className="w-6 h-6 text-[hsl(var(--chart-1))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(var(--chart-2))] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Games Played</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-[hsl(var(--chart-2))] to-green-600 bg-clip-text text-transparent">
                    {analytics.overview.totalGamesPlayed.toLocaleString()}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">across all students</p>
              </div>
              <div className="p-3 rounded-lg bg-[hsl(var(--chart-2))]/10">
                <svg className="w-6 h-6 text-[hsl(var(--chart-2))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[hsl(var(--chart-3))] shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Active Engagement</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-[hsl(var(--chart-3))] to-yellow-600 bg-clip-text text-transparent">
                    {totalModulesCompleted}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground">modules completed</p>
              </div>
              <div className="p-3 rounded-lg bg-[hsl(var(--chart-3))]/10">
                <svg className="w-6 h-6 text-[hsl(var(--chart-3))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid - Main Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Student Engagement - Area Chart */}
        <Card className="lg:col-span-2 shadow-sm hover:shadow-md transition-shadow border-t-2 border-t-[hsl(var(--chart-1))]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                  <div className="w-1 h-6 bg-[hsl(var(--chart-1))] rounded-full"></div>
                  Student Engagement
                </CardTitle>
                <CardDescription className="mt-1">Monthly Active Users - Last 12 Months</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-[hsl(var(--chart-1))]/10 text-[hsl(var(--chart-1))] border-[hsl(var(--chart-1))]/20">
                Trending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <EngagementChart data={analytics.engagementData} />
          </CardContent>
        </Card>

        {/* Module Completions - Bar Chart */}
        <Card className="shadow-sm hover:shadow-md transition-shadow border-t-2 border-t-[hsl(var(--chart-2))]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <div className="w-1 h-6 bg-[hsl(var(--chart-2))] rounded-full"></div>
                  Module Performance
                </CardTitle>
                <CardDescription className="mt-1">Top modules by completion rate</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-[hsl(var(--chart-2))]/10 text-[hsl(var(--chart-2))] border-[hsl(var(--chart-2))]/20">
                Top 8
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ModuleChart data={analytics.moduleCompletionData} />
          </CardContent>
        </Card>

        {/* Game Distribution - Pie Chart */}
        <Card className="shadow-sm hover:shadow-md transition-shadow border-t-2 border-t-[hsl(var(--chart-3))]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <div className="w-1 h-6 bg-[hsl(var(--chart-3))] rounded-full"></div>
                  Game Distribution
                </CardTitle>
                <CardDescription className="mt-1">Games played by type</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-[hsl(var(--chart-3))]/10 text-[hsl(var(--chart-3))] border-[hsl(var(--chart-3))]/20">
                Overview
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <GameDistributionChart 
              data={analytics.gameTypeData} 
              totalGames={analytics.overview.totalGamesPlayed}
            />
          </CardContent>
        </Card>
      </div>

      {/* Top Students */}
      <Card className="shadow-sm hover:shadow-md transition-shadow border-t-2 border-t-[hsl(var(--chart-4))]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <div className="w-1 h-6 bg-[hsl(var(--chart-4))] rounded-full"></div>
                Top Performing Students
              </CardTitle>
              <CardDescription className="mt-1">
                Students ranked by games played and performance
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-[hsl(var(--chart-4))]/10 text-[hsl(var(--chart-4))] border-[hsl(var(--chart-4))]/20">
              {students.length} Students
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-center">Games</TableHead>
                  <TableHead className="text-center">Modules</TableHead>
                  <TableHead className="text-center">Avg Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  const avgScore =
                    student.gamesScores.length > 0
                      ? Math.round(
                          student.gamesScores.reduce(
                            (sum, score) => sum + score.score,
                            0
                          ) / student.gamesScores.length
                        )
                      : 0;

                  return (
                    <TableRow key={student.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[hsl(var(--chart-1))]/10 flex items-center justify-center">
                            <span className="text-xs font-semibold text-[hsl(var(--chart-1))]">
                              {(student.user.name || student.user.username).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          {student.user.name || student.user.username}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.user.email}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="bg-[hsl(var(--chart-2))]/10 text-[hsl(var(--chart-2))] border-[hsl(var(--chart-2))]/20">
                          {student.gamesPlayed}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="border-[hsl(var(--chart-3))] text-[hsl(var(--chart-3))]">
                          {student.modulesCompleted.length}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full font-semibold text-sm ${
                          avgScore >= 70
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : avgScore >= 50
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {avgScore}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
              <p className="text-muted-foreground">No student data available.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-sm hover:shadow-md transition-shadow border-t-2 border-t-[hsl(var(--chart-5))]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <div className="w-1 h-6 bg-[hsl(var(--chart-5))] rounded-full"></div>
                Recent Activity
              </CardTitle>
              <CardDescription className="mt-1">Latest game sessions from students</CardDescription>
            </div>
            <Badge variant="secondary" className="bg-[hsl(var(--chart-5))]/10 text-[hsl(var(--chart-5))] border-[hsl(var(--chart-5))]/20">
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all hover:shadow-sm group"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--chart-5))] to-orange-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-semibold text-sm">
                        {(activity.student.user.name || activity.student.user.username).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold group-hover:text-[hsl(var(--chart-5))] transition-colors">
                        {activity.student.user.name ||
                          activity.student.user.username}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <p className="text-sm text-muted-foreground">
                          {activity.gameName.replace(/_/g, " ")}
                        </p>
                        <Badge variant="secondary" className="text-xs bg-[hsl(var(--chart-5))]/10 text-[hsl(var(--chart-5))] border-[hsl(var(--chart-5))]/20">
                          {activity.gameType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full font-bold text-base mb-1 ${
                      activity.score >= 70
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : activity.score >= 50
                        ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {activity.score}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.playedAt).toLocaleDateString()}
                    </p>
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <p className="text-muted-foreground">No recent activity.</p>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
