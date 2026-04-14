import { NextResponse } from "next/server";
import { getContactRateLimitStatus } from "@/lib/contactRateLimit";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 2400;
const MAX_BODY_BYTES = 10_000;
const SUPPORTED_CONTENT_TYPE = "application/json";
const RESEND_TIMEOUT_MS = 10_000;

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  companyWebsite?: string;
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

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes(SUPPORTED_CONTENT_TYPE)) {
    return NextResponse.json(
      { error: "Content-Type must be application/json." },
      { status: 415 },
    );
  }

  const rawContentLength = request.headers.get("content-length");
  if (rawContentLength) {
    const contentLength = Number.parseInt(rawContentLength, 10);
    if (!Number.isFinite(contentLength) || contentLength < 0) {
      return NextResponse.json(
        { error: "Invalid Content-Length header." },
        { status: 400 },
      );
    }

    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { error: "Request body too large." },
        { status: 413 },
      );
    }
  }

  const clientIp = getClientIp(request);
  const rateLimitStatus = await getContactRateLimitStatus(clientIp);
  if (rateLimitStatus.limited) {
    return NextResponse.json(
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

  const body = (await request.json().catch(() => null)) as ContactPayload | null;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      {
        error: "Invalid request payload.",
      },
      { status: 400 },
    );
  }

  if (normalizeValue(body.companyWebsite)) {
    return NextResponse.json(
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
    return NextResponse.json(
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
    return NextResponse.json(
      {
        error: "Your message is a bit too long. Please shorten it and try again.",
      },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
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
    return NextResponse.json(
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
    return NextResponse.json(
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
    return NextResponse.json(
      {
        error:
          "I could not send your message just now. Please try again or use the direct email option.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
