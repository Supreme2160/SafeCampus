import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prismaSingleton";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, name, userType } = body;

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name,
        userType: userType || "STUDENT",
      },
    });

    // If user is a student, create student record
    if (user.userType === "STUDENT") {
      await prisma.student.create({
        data: {
          userId: user.id,
        },
      });
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          userType: user.userType,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
