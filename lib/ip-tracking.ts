import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface IPTrackingEntry {
  count: number;
  lastActivity: number;
  suspiciousFlags: number;
}

const ipTrackingStore = new Map<string, IPTrackingEntry>();

export async function validateIPRequest(request: NextRequest): Promise<{
  allowed: boolean;
  reason?: string;
  shouldTrack?: boolean;
}> {
  const clientIp = getClientIP(request);
  const now = Date.now();

  // Clean up old entries (older than 24 hours)
  for (const [ip, entry] of ipTrackingStore.entries()) {
    if (now - entry.lastActivity > 24 * 60 * 60 * 1000) {
      ipTrackingStore.delete(ip);
    }
  }

  const entry = ipTrackingStore.get(clientIp) || {
    count: 0,
    lastActivity: now,
    suspiciousFlags: 0,
  };

  // Check for suspicious patterns
  const recentActivityCount = entry.count;
  const timeSinceLastActivity = now - entry.lastActivity;

  // Flag 1: Too many requests in short time
  if (timeSinceLastActivity < 1000 && recentActivityCount > 50) {
    // 50 requests in < 1 second
    entry.suspiciousFlags++;
    return {
      allowed: false,
      reason: "Too many rapid requests",
      shouldTrack: true,
    };
  }

  // Flag 2: High frequency requests over time
  if (recentActivityCount > 1000 && timeSinceLastActivity < 60000) {
    // 1000+ requests in < 1 minute
    entry.suspiciousFlags++;
    return {
      allowed: false,
      reason: "Excessive request frequency",
      shouldTrack: true,
    };
  }

  // Flag 3: Already flagged multiple times
  if (entry.suspiciousFlags >= 3) {
    return {
      allowed: false,
      reason: "IP temporarily blocked due to suspicious activity",
      shouldTrack: true,
    };
  }

  // Update tracking
  entry.count++;
  entry.lastActivity = now;
  ipTrackingStore.set(clientIp, entry);

  return { allowed: true };
}

export async function blockIPs(
  blockedIPs: string[],
  _durationMs: number = 60 * 60 * 1000
) {
  // This would typically integrate with a firewall or CDN
  // For now, we'll add them to our in-memory tracking with high suspicion
  const now = Date.now();
  for (const ip of blockedIPs) {
    ipTrackingStore.set(ip, {
      count: 1000,
      lastActivity: now,
      suspiciousFlags: 10,
    });
  }
}

export function getClientIP(request: NextRequest): string {
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

  // Fallback to a default identifier
  return "unknown";
}

export async function logIPActivity(
  request: NextRequest,
  action: string,
  metadata?: any
) {
  const clientIp = getClientIP(request);
  const supabase = await createClient();

  try {
    await supabase.from("ip_activity_log").insert({
      ip_address: clientIp,
      action,
      user_agent: request.headers.get("user-agent") || "",
      metadata,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to log IP activity:", error);
  }
}
