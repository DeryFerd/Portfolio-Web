import { NextResponse } from "next/server";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 2400;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RESEND_TIMEOUT_MS = 10_000;

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const globalForRateLimit = globalThis as typeof globalThis & {
  __contactRateLimitMap?: Map<string, RateLimitBucket>;
};

const rateLimitMap =
  globalForRateLimit.__contactRateLimitMap ??
  (globalForRateLimit.__contactRateLimitMap = new Map<string, RateLimitBucket>());

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

function isRateLimited(clientIp: string, now = Date.now()) {
  const current = rateLimitMap.get(clientIp);

  if (!current || now >= current.resetAt) {
    rateLimitMap.set(clientIp, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  rateLimitMap.set(clientIp, current);
  return false;
}

function pruneRateLimitMap(now = Date.now()) {
  for (const [ip, bucket] of rateLimitMap.entries()) {
    if (bucket.resetAt <= now) {
      rateLimitMap.delete(ip);
    }
  }
}

export async function POST(request: Request) {
  pruneRateLimitMap();

  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      {
        error: "Too many requests. Please wait a few minutes and try again.",
      },
      { status: 429 },
    );
  }

  const body = (await request.json().catch(() => null)) as ContactPayload | null;

  const name = normalizeValue(body?.name);
  const email = normalizeValue(body?.email).toLowerCase();
  const message = normalizeValue(body?.message);

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
