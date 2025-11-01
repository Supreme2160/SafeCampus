import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authHandler } from "@/lib/authHandler";
import prisma from "@/lib/prismaSingleton";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authHandler);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { gameName, gameType, score } = body;

    // Validate input
    if (!gameName || !gameType || typeof score !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: gameName, gameType, score" },
        { status: 400 }
      );
    }

    // Get student record
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { student: true },
    });

    if (!user || !user.student) {
      return NextResponse.json(
        { error: "Student record not found" },
        { status: 404 }
      );
    }

    // Create game score entry
    const gameScore = await prisma.gameScore.create({
      data: {
        studentId: user.student.id,
        gameName,
        gameType,
        score,
      },
    });

    // Update student's total games played count
    await prisma.student.update({
      where: { id: user.student.id },
      data: {
        gamesPlayed: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
      gameScore: {
        id: gameScore.id,
        score: gameScore.score,
        playedAt: gameScore.playedAt,
      },
      message: "Game score saved successfully!",
    });
  } catch (error) {
    console.error("Error saving game score:", error);
    return NextResponse.json(
      { error: "Failed to save game score" },
      { status: 500 }
    );
  }
}
