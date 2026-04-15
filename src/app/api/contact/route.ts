import { NextResponse } from "next/server";
import {
  getContactRateLimitStatus,
  hasDistributedRateLimitBackend,
} from "@/lib/contactRateLimit";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 2400;
const MAX_BODY_BYTES = 10_000;
const SUPPORTED_CONTENT_TYPE = "application/json";
const RESEND_TIMEOUT_MS = 10_000;
const IS_PRODUCTION = process.env.NODE_ENV === "production";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  companyWebsite?: string;
}

interface JsonResponseInit {
  status?: number;
  headers?: HeadersInit;
}

function normalizeValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitizeHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) {
    return cfIp.trim();
  }

  return "unknown";
}

function getAllowedOrigins() {
  const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const defaults = IS_PRODUCTION
    ? []
    : ["http://localhost:3000", "http://127.0.0.1:3000"];

  return [...new Set([configuredOrigin, ...defaults].filter(Boolean) as string[])];
}

function isAllowedOrigin(origin: string) {
  try {
    const normalizedOrigin = new URL(origin).origin;
    return getAllowedOrigins().includes(normalizedOrigin);
  } catch {
    return false;
  }
}

function jsonResponse(payload: object, init: JsonResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  headers.set("Vary", "Origin");

  return NextResponse.json(payload, {
    ...init,
    headers,
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const isBrowserRequest = Boolean(origin);
  if (isBrowserRequest && (!origin || !isAllowedOrigin(origin))) {
    return jsonResponse(
      { error: "Forbidden." },
      { status: 403 },
    );
  }

  if (IS_PRODUCTION && !hasDistributedRateLimitBackend()) {
    return jsonResponse(
      { error: "Service temporarily unavailable." },
      { status: 503 },
    );
  }

  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes(SUPPORTED_CONTENT_TYPE)) {
    return jsonResponse(
      { error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  const rawContentLength = request.headers.get("content-length");
  if (rawContentLength) {
    const contentLength = Number.parseInt(rawContentLength, 10);
    if (!Number.isFinite(contentLength) || contentLength < 0) {
      return jsonResponse(
        { error: "Invalid Content-Length header." },
        { status: 400 },
      );
    }

    if (contentLength > MAX_BODY_BYTES) {
      return jsonResponse(
        { error: "Request body too large." },
        { status: 413 },
      );
    }
  }

  const clientIp = getClientIp(request);
  const rateLimitStatus = await getContactRateLimitStatus(clientIp);
  if (rateLimitStatus.limited) {
    return jsonResponse(
      {
        error: "Too many requests. Please wait a few minutes and try again.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimitStatus.retryAfterSeconds.toString(),
        },
      },
    );
  }

  const rawBody = await request.text().catch(() => null);
  if (!rawBody) {
    return jsonResponse(
      {
        error: "Invalid request payload.",
      },
      { status: 400 },
    );
  }

  if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
    return jsonResponse(
      { error: "Request body too large." },
      { status: 413 },
    );
  }

  let body: ContactPayload | null = null;
  try {
    body = (JSON.parse(rawBody) as ContactPayload | null) ?? null;
  } catch {
    body = null;
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonResponse(
      {
        error: "Invalid request payload.",
      },
      { status: 400 },
    );
  }

  if (normalizeValue(body.companyWebsite)) {
    return jsonResponse(
      {
        error: "Your message could not be sent right now.",
      },
      { status: 400 },
    );
  }

  const name = normalizeValue(body.name);
  const email = normalizeValue(body.email).toLowerCase();
  const message = normalizeValue(body.message);

  if (!name || !email || !message) {
    return jsonResponse(
      {
        error: "Please fill in your name, email, and message first.",
      },
      { status: 400 },
    );
  }

  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return jsonResponse(
      {
        error: "Your message is a bit too long. Please shorten it and try again.",
      },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return jsonResponse(
      {
        error: "Please use a valid email address so I can reply to you.",
      },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    return jsonResponse(
      {
        error:
          "The contact form is not configured yet. Please use the direct email option for now.",
      },
      { status: 503 },
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll("\n", "<br />");

  const safeSubjectName = sanitizeHeaderValue(name);
  const safeReplyEmail = sanitizeHeaderValue(email);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: [safeReplyEmail],
        subject: `Portfolio message from ${safeSubjectName}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: Arial, Helvetica, sans-serif; color: #1f1d1a; line-height: 1.6;">
            <h2 style="margin: 0 0 12px;">New portfolio message</h2>
            <p style="margin: 0 0 6px;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin: 0 0 18px;"><strong>Email:</strong> ${safeEmail}</p>
            <div style="padding: 16px; border: 1px solid #e4dbcf; border-radius: 12px; background: #faf6ef;">
              <p style="margin: 0 0 8px;"><strong>Message</strong></p>
              <p style="margin: 0;">${safeMessage}</p>
            </div>
          </div>
        `,
      }),
      cache: "no-store",
      signal: controller.signal,
    });
  } catch {
    return jsonResponse(
      {
        error:
          "I could not send your message just now. Please try again or use the direct email option.",
      },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    return jsonResponse(
      {
        error:
          "I could not send your message just now. Please try again or use the direct email option.",
      },
      { status: 502 },
    );
  }

  return jsonResponse({ ok: true });
}
