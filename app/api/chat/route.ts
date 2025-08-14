import { NextRequest, NextResponse } from "next/server";
import { SupervisorAgent } from "@/lib/agents/supervisor";

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();
    
    if (!transcript) {
      return NextResponse.json(
        { error: "Transcript is required" },
        { status: 400 }
      );
    }

    const supervisor = new SupervisorAgent();
    const result = await supervisor.processUserQuery(transcript);

    return NextResponse.json({
      success: true,
      response: result.finalResponse,
      processingSteps: result.processingSteps,
      confidence: result.confidence,
      followUpSuggestions: result.followUpSuggestions
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}