import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authHandler } from "@/lib/authHandler";
import prisma from "@/lib/prismaSingleton";

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
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Teacher Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track student progress
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Total Students
              </p>
              <h3 className="text-3xl font-bold mt-2">{totalStudents}</h3>
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
                Total Games Played
              </p>
              <h3 className="text-3xl font-bold mt-2">{totalGamesPlayed}</h3>
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
                  d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">
                Modules Completed
              </p>
              <h3 className="text-3xl font-bold mt-2">
                {totalModulesCompleted}
              </h3>
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Top Students */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Top Performing Students</h2>
        {students.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Games Played
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Modules
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                    Avg Score
                  </th>
                </tr>
              </thead>
              <tbody>
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
                    <tr key={student.id} className="border-b last:border-0">
                      <td className="py-3 px-4 font-medium">
                        {student.user.name || student.user.username}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {student.user.email}
                      </td>
                      <td className="py-3 px-4">{student.gamesPlayed}</td>
                      <td className="py-3 px-4">
                        {student.modulesCompleted.length}
                      </td>
                      <td className="py-3 px-4">
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No student data available.
          </p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
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
                    <p className="text-sm text-muted-foreground">
                      Played {activity.gameName.replace(/_/g, " ")} •{" "}
                      {activity.gameType}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">{activity.score}%</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.playedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No recent activity.
          </p>
        )}
      </div>
    </div>
  );
}
