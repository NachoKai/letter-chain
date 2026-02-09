import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<{ success: boolean; response?: NextResponse }> {
  const clientIp = getClientIP(request);
  const key = `rate_limit:${clientIp}`;
  const now = Date.now();

  // Clean up expired entries
  for (const [entryKey, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(entryKey);
    }
  }

  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return { success: true };
  }

  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      response: NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((entry.resetTime - now) / 1000).toString(),
            "X-RateLimit-Limit": config.maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": entry.resetTime.toString(),
          },
        }
      ),
    };
  }

  entry.count++;

  return {
    success: true,
  };
}

function getClientIP(request: NextRequest): string {
  // Try various headers for the real IP
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return "unknown";
}

export async function trackSuspiciousActivity(
  request: NextRequest,
  reason: string,
  metadata?: any
) {
  const clientIp = getClientIP(request);
  const supabase = await createClient();

  try {
    await supabase.from("suspicious_activity").insert({
      ip_address: clientIp,
      user_agent: request.headers.get("user-agent") || "",
      reason,
      metadata,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to track suspicious activity:", error);
  }
}
