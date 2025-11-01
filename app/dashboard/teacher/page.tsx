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

  const { totalStudents, students } = await getStudentStats();
  const recentActivity = await getRecentActivity();

  const totalGamesPlayed = students.reduce(
    (sum, student) => sum + student.gamesPlayed,
    0
  );
  const totalModulesCompleted = students.reduce(
    (sum, student) => sum + student.modulesCompleted.length,
    0
  );

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Teacher Dashboard"
        roleLabel="Teacher"
        subtitle="Manage classes, track progress, and guide students through safety training."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Students"
          value={totalStudents}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Total Games Played"
          value={totalGamesPlayed}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          }
        />
        <StatsCard
          title="Modules Completed"
          value={totalModulesCompleted}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Top Students */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Students</CardTitle>
          <CardDescription>
            Students ranked by games played and performance
          </CardDescription>
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
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        {student.user.name || student.user.username}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {student.user.email}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{student.gamesPlayed}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">
                          {student.modulesCompleted.length}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`font-semibold ${
                            avgScore >= 70
                              ? "text-green-500"
                              : avgScore >= 50
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        >
                          {avgScore}%
                        </span>
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
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest game sessions from students</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">
                        {activity.student.user.name ||
                          activity.student.user.username}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-muted-foreground">
                          {activity.gameName.replace(/_/g, " ")}
                        </p>
                        <Badge variant="secondary" className="text-xs">
                          {activity.gameType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold text-lg ${
                        activity.score >= 70
                          ? "text-green-500"
                          : activity.score >= 50
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {activity.score}%
                    </p>
                    <p className="text-sm text-muted-foreground">
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
  );
}
