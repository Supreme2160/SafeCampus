import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authHandler } from "@/lib/authHandler";
import prisma from "@/lib/prismaSingleton";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authHandler);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify teacher access
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { teacher: true },
    });

    if (!user || user.userType !== "TEACHER") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    // Get overall statistics
    const totalStudents = await prisma.student.count();
    const totalModules = await prisma.modules.count();
    
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
    const monthlyData: Record<string, { activeUsers: number; gamesPlayed: number }> = {};
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyData[key] = { activeUsers: 0, gamesPlayed: 0 };
    }

    const activeUsersByMonth = new Set<string>();
    students.forEach(student => {
      student.gamesScores.forEach(score => {
        const date = new Date(score.playedAt);
        const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (monthlyData[key]) {
          activeUsersByMonth.add(`${key}-${student.id}`);
          monthlyData[key].gamesPlayed++;
        }
      });
    });

    // Count unique active users per month
    Object.keys(monthlyData).forEach(key => {
      const count = Array.from(activeUsersByMonth).filter(str => str.startsWith(key + '-')).length;
      monthlyData[key].activeUsers = count;
    });

    const engagementData = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      activeUsers: data.activeUsers,
    }));

    // Student growth over time
    const studentsByMonth = await prisma.student.findMany({
      select: {
        enrolledAt: true,
      },
      orderBy: {
        enrolledAt: 'asc',
      },
    });

    const studentGrowth: Record<string, number> = {};
    studentsByMonth.forEach(student => {
      const date = new Date(student.enrolledAt);
      const key = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      studentGrowth[key] = (studentGrowth[key] || 0) + 1;
    });

    // Calculate cumulative growth
    let cumulative = 0;
    const growthData = Object.entries(studentGrowth).map(([month, count]) => {
      cumulative += count;
      return { month, students: cumulative };
    });

    // Module completion stats
    const moduleStats = await prisma.modules.findMany({
      include: {
        completedBy: true,
      },
    });

    const moduleCompletionData = moduleStats.map(module => ({
      module: module.title.length > 20 ? module.title.substring(0, 20) + '...' : module.title,
      completions: module.completedBy.length,
    })).sort((a, b) => b.completions - a.completions).slice(0, 10);

    // Game type distribution
    const allGameScores = await prisma.gameScore.findMany({
      select: {
        gameName: true,
      },
    });

    const gameDistribution: Record<string, number> = {};
    allGameScores.forEach(score => {
      gameDistribution[score.gameName] = (gameDistribution[score.gameName] || 0) + 1;
    });

    const gameTypeData = Object.entries(gameDistribution).map(([name, count]) => ({
      name: name.replace(/_/g, ' '),
      value: count,
    }));

    // Calculate percentage growth metrics
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

    // Average completion rate
    const avgCompletionRate = moduleStats.length > 0
      ? Math.round((moduleStats.reduce((sum, m) => sum + m.completedBy.length, 0) / (moduleStats.length * totalStudents)) * 100)
      : 0;

    return NextResponse.json({
      overview: {
        totalStudents,
        totalModules,
        studentGrowthPercent,
        avgCompletionRate,
      },
      engagementData,
      growthData,
      moduleCompletionData,
      gameTypeData,
    });

  } catch (error) {
    console.error("Error fetching teacher analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
