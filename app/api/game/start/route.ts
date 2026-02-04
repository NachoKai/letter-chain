import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { sessionToken, language = "es" } = await request.json();

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { error } = await supabase.from("game_sessions").insert({
      session_token: sessionToken,
      language,
      started_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error creating game session:", error);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Game start error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
