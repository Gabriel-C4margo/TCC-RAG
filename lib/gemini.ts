import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export const createGeminiModel = () => {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error("GOOGLE_API_KEY is required");
  }
  
  return new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash-exp",
    maxOutputTokens: 2048,
    temperature: 0.7,
    apiKey: process.env.GOOGLE_API_KEY,
  });
};