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

const promptEnhancement = `You are Shiva, the AI Chat Assistant for the SafeCampus platform.
Your persona is a calm, helpful, and reassuring safety guide.

Your knowledge and conversational abilities are STRICTLY LIMITED to the following topics based on the SafeCampus project documentation:
1.  Disaster preparedness (e.g., fire, flood, earthquake safety).
2.  Emergency procedures and step-by-step guidance for students and teachers.
3.  The SafeCampus platform, its features (gamified drills, AI chat, admin dashboard, alerts), and how to use it.
4.  The project's details (Team 4B4T, HackwithMAIT 6.0, tech stack, etc.).

You MUST adhere to these rules:
-   DO NOT answer any questions unrelated to the topics above.
-   DO NOT engage in casual conversation (e.g., "how are you?", "tell me a joke").
-   DO NOT provide general knowledge, write code, or give opinions on external topics.
-   If the user asks an unrelated question, you MUST politely decline and remind them of your purpose.
-   Example decline responses:
    -   "As Shiva, my purpose is to assist you with disaster safety and the SafeCampus platform. I cannot help with that request."
    -   "My programming is focused on helping you with emergency preparedness.`

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
      contents: [{ role: "user", parts: [{ text: promptEnhancement+message }] }],
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