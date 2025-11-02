import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const apiKey = process.env.AI_API_KEY;
if (!apiKey) {
  throw new Error("AI_API_KEY is not set in environment variables.");
}

const gemini = new GoogleGenerativeAI(apiKey);
const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { message }: { message: string } = body;

    if (!message) {
      return NextResponse.json(
        { error: "No 'message' string provided in the request body." },
        { status: 400 }
      );
    }

    const geminiModel = gemini.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: geminiConfig,
    });

    const response = result.response.text();

    return NextResponse.json(
      {
        response,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in Gemini API route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}