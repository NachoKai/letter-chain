import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  rateLimit,
  trackSuspiciousActivity,
  RateLimitConfig,
} from "@/lib/rate-limit";
import { validateIPRequest, logIPActivity } from "@/lib/ip-tracking";
import {
  validateRequest,
  trackSuspiciousRequest,
  gameStartValidation,
} from "@/lib/request-validation";

const START_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 10, // Max 10 game starts per minute
};

export async function POST(request: NextRequest) {
  try {
    const { sessionToken, language = "es" } = await request.json();

    // Request validation
    const validation = validateRequest(request, gameStartValidation, {
      sessionToken,
      language,
    });
    if (!validation.valid) {
      if (validation.shouldTrack) {
        await trackSuspiciousRequest(request, "Invalid request data", {
          sessionToken,
          language,
        });
      }
      return NextResponse.json(
        { error: "Invalid request data", details: validation.errors },
        { status: 400 }
      );
    }

    // IP validation
    const ipValidation = await validateIPRequest(request);
    if (!ipValidation.allowed) {
      if (ipValidation.shouldTrack) {
        await trackSuspiciousActivity(
          request,
          ipValidation.reason || "IP blocked"
        );
      }
      return NextResponse.json(
        { error: ipValidation.reason || "Request blocked" },
        { status: 429 }
      );
    }

    // Rate limiting
    const rateLimitResult = await rateLimit(request as any, START_RATE_LIMIT);
    if (!rateLimitResult.success && rateLimitResult.response) {
      return rateLimitResult.response;
    }

    // Log activity
    await logIPActivity(request, "game_start", { language });

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
