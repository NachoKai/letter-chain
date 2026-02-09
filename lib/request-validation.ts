import { NextRequest } from "next/server";
import { trackSuspiciousActivity } from "@/lib/rate-limit";

interface ValidationRule {
  field: string;
  required?: boolean;
  type?: "string" | "number" | "array" | "boolean";
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  shouldTrack?: boolean;
}

export function validateRequest(
  request: NextRequest,
  rules: Record<string, ValidationRule>,
  data: any
): ValidationResult {
  const errors: string[] = [];
  let shouldTrack = false;

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];

    // Required validation
    if (
      rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push(`${field} is required`);
      continue;
    }

    // Skip further validation if field is optional and not present
    if (
      !rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      continue;
    }

    // Type validation
    if (rule.type) {
      const actualType = Array.isArray(value) ? "array" : typeof value;
      if (actualType !== rule.type) {
        errors.push(`${field} must be of type ${rule.type}`);
        shouldTrack = true;
        continue;
      }
    }

    // String validations
    if (typeof value === "string") {
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors.push(`${field} must be at least ${rule.minLength} characters`);
      }
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        errors.push(`${field} must be at most ${rule.maxLength} characters`);
      }
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
        shouldTrack = true;
      }
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rule.enum.join(", ")}`);
        shouldTrack = true;
      }
    }

    // Number validations
    if (typeof value === "number") {
      if (rule.min !== undefined && value < rule.min) {
        errors.push(`${field} must be at least ${rule.min}`);
        shouldTrack = true;
      }
      if (rule.max !== undefined && value > rule.max) {
        errors.push(`${field} must be at most ${rule.max}`);
        shouldTrack = true;
      }
    }

    // Array validations
    if (Array.isArray(value)) {
      if (rule.minLength !== undefined && value.length < rule.minLength) {
        errors.push(`${field} must have at least ${rule.minLength} items`);
      }
      if (rule.maxLength !== undefined && value.length > rule.maxLength) {
        errors.push(`${field} must have at most ${rule.maxLength} items`);
      }
    }
  }

  // Additional security checks
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /eval\s*\(/i,
    /function\s*\(/i,
    /document\./i,
    /window\./i,
    /global\./i,
  ];

  const dataString = JSON.stringify(data);
  if (suspiciousPatterns.some((pattern) => pattern.test(dataString))) {
    errors.push("Invalid characters detected");
    shouldTrack = true;
  }

  return {
    valid: errors.length === 0,
    errors,
    shouldTrack,
  };
}

export async function trackSuspiciousRequest(
  request: NextRequest,
  reason: string,
  data: any
) {
  await trackSuspiciousActivity(request, reason, {
    requestData: data,
    userAgent: request.headers.get("user-agent"),
    timestamp: new Date().toISOString(),
  });
}

// Predefined validation schemas
export const gameStartValidation: Record<string, ValidationRule> = {
  sessionToken: {
    field: "sessionToken",
    required: true,
    type: "string",
    minLength: 32,
    pattern: /^[a-f0-9]+$/i,
  },
  language: {
    field: "language",
    required: false,
    type: "string",
    enum: ["es", "en"],
  },
};

export const gameSubmitValidation: Record<string, ValidationRule> = {
  playerName: {
    field: "playerName",
    required: true,
    type: "string",
    minLength: 1,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9\s\-_]+$/,
  },
  score: {
    field: "score",
    required: true,
    type: "number",
    min: 0,
    max: 10000,
  },
  wordsCount: {
    field: "wordsCount",
    required: true,
    type: "number",
    min: 0,
    max: 100,
  },
  longestChain: {
    field: "longestChain",
    required: true,
    type: "number",
    min: 0,
    max: 100,
  },
  sessionToken: {
    field: "sessionToken",
    required: true,
    type: "string",
    minLength: 32,
    pattern: /^[a-f0-9]+$/i,
  },
  words: {
    field: "words",
    required: true,
    type: "array",
    minLength: 0,
    maxLength: 100,
  },
  countryCode: {
    field: "countryCode",
    required: false,
    type: "string",
    minLength: 2,
    maxLength: 2,
    pattern: /^[A-Z]{2}$/,
  },
  countryName: {
    field: "countryName",
    required: false,
    type: "string",
    maxLength: 100,
  },
  countryFlag: {
    field: "countryFlag",
    required: false,
    type: "string",
    maxLength: 10,
  },
};
