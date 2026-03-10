import { createOpenAI } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  compatibility: "compatible",
});

const portfolioContext = fs.readFileSync(
  path.join(process.cwd(), "src/data/llms-full.txt"),
  "utf-8"
);

const systemPrompt = `You are a helpful assistant on Shafiq Ninaba's portfolio website. Your role is to answer questions about Shafiq based on the information provided below.

Be friendly, professional, and concise in your responses. If someone asks something not covered in the context, politely let them know you can only answer questions about Shafiq's background, projects, and experience.

---
PORTFOLIO INFORMATION:
${portfolioContext}
---

Guidelines:
- Answer questions about Shafiq's projects, skills, experience, and background
- Be conversational and engaging
- If asked about contact information, direct them to the contact section of the website
- Keep responses concise but informative
- Use the provided information accurately - don't make things up`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: openrouter(process.env.OPENROUTER_MODEL ?? "google/gemini-2.0-flash-001"),
    system: systemPrompt,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
