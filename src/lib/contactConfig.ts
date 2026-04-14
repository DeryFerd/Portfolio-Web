const FALLBACK_CONTACT_EMAIL = "hello@yourdomain.com";

function isValidPublicEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

const publicEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() ?? "";

export const CONTACT_EMAIL = isValidPublicEmail(publicEmail)
  ? publicEmail
  : FALLBACK_CONTACT_EMAIL;
