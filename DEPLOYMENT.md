# Deployment Guide (Vercel)

## 1. Prerequisites
- GitHub repository connected to Vercel
- Node.js LTS locally (for pre-deploy checks)

## 2. Local Validation
Run this before pushing:

```bash
npm install
npm run build
```

## 3. Required Environment Variables (Vercel Project)
Set these in Vercel Project Settings -> Environment Variables:

```env
RESEND_API_KEY=re_your_resend_api_key
CONTACT_TO_EMAIL=hello@yourdomain.com
CONTACT_FROM_EMAIL=Portfolio Contact <hello@yourdomain.com>
NEXT_PUBLIC_CONTACT_EMAIL=hello@yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
UPSTASH_REDIS_REST_URL=https://your-upstash-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

Optional but recommended:

```env
GITHUB_TOKEN=ghp_xxx
NEXT_PUBLIC_GITHUB_USERNAME=DeryFerd
```

## 4. Vercel Deployment Flow
1. Push to `main` -> production deployment.
2. Push to feature branch / PR -> preview deployment.
3. Confirm the deployment build logs are green.

## 5. Post-Deploy Smoke Checklist
- Home page loads in light/dark mode.
- `Core Stack` icons render correctly.
- `Download My CV` downloads from `/documents/dery-ferdika-cv.pdf`.
- Contact form:
  - valid request works,
  - invalid origin is blocked,
  - rate limiting responds with 429 when abused.

## 6. Notes
- Security headers and CSP are configured in `next.config.ts`.
- Contact API hardening is in `src/app/api/contact/route.ts`.
- Distributed rate limiting is in `src/lib/contactRateLimit.ts` and relies on Upstash Redis in production.
