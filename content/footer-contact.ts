function optionalHttpsUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function optionalEmail(value: string | undefined) {
  const email = value?.trim();
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? `mailto:${email}`
    : null;
}

export const footerContactLinks = [
  {
    label: "Instagram",
    href: optionalHttpsUrl(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  },
  {
    label: "TikTok",
    href: optionalHttpsUrl(process.env.NEXT_PUBLIC_TIKTOK_URL),
  },
  {
    label: "Email",
    href: optionalEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
  },
] as const;
