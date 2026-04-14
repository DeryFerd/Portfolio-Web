import { Redis } from "@upstash/redis";
import { createHash } from "crypto";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

export interface RateLimitStatus {
  limited: boolean;
  retryAfterSeconds: number;
}

const globalForRateLimit = globalThis as typeof globalThis & {
  __contactRateLimitMap?: Map<string, RateLimitBucket>;
  __contactRateLimitRedis?: Redis;
};

const rateLimitMap =
  globalForRateLimit.__contactRateLimitMap ??
  (globalForRateLimit.__contactRateLimitMap = new Map<string, RateLimitBucket>());

function getRedisClient() {
  if (globalForRateLimit.__contactRateLimitRedis) {
    return globalForRateLimit.__contactRateLimitRedis;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return null;
  }

  globalForRateLimit.__contactRateLimitRedis = new Redis({ url, token });
  return globalForRateLimit.__contactRateLimitRedis;
}

function hashIp(clientIp: string) {
  return createHash("sha256").update(clientIp).digest("hex").slice(0, 24);
}

function getMemoryRateLimitStatus(clientIp: string, now = Date.now()): RateLimitStatus {
  const current = rateLimitMap.get(clientIp);

  if (!current || now >= current.resetAt) {
    rateLimitMap.set(clientIp, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return {
      limited: false,
      retryAfterSeconds: 0,
    };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      limited: true,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  rateLimitMap.set(clientIp, current);

  return {
    limited: false,
    retryAfterSeconds: 0,
  };
}

function pruneRateLimitMap(now = Date.now()) {
  for (const [ip, bucket] of rateLimitMap.entries()) {
    if (bucket.resetAt <= now) {
      rateLimitMap.delete(ip);
    }
  }
}

async function getRedisRateLimitStatus(clientIp: string): Promise<RateLimitStatus> {
  const redis = getRedisClient();
  if (!redis) {
    pruneRateLimitMap();
    return getMemoryRateLimitStatus(clientIp);
  }

  const key = `contact:rate-limit:${hashIp(clientIp)}`;
  const windowSeconds = Math.floor(RATE_LIMIT_WINDOW_MS / 1000);

  try {
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, windowSeconds);
    }

    if (count > RATE_LIMIT_MAX_REQUESTS) {
      const ttl = await redis.ttl(key);
      return {
        limited: true,
        retryAfterSeconds: ttl > 0 ? ttl : windowSeconds,
      };
    }

    return {
      limited: false,
      retryAfterSeconds: 0,
    };
  } catch {
    pruneRateLimitMap();
    return getMemoryRateLimitStatus(clientIp);
  }
}

export async function getContactRateLimitStatus(
  clientIp: string,
): Promise<RateLimitStatus> {
  return getRedisRateLimitStatus(clientIp);
}

