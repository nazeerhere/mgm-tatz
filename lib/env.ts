const requiredPublicEnvironment = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
] as const;

export function hasSupabaseEnvironment() {
  return requiredPublicEnvironment.every((name) => Boolean(process.env[name]));
}

export function allowsDevelopmentFallback(environment = process.env.NODE_ENV) {
  return environment !== "production";
}

export function getSupabaseEnvironment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    throw new Error("Supabase development environment is not configured.");
  }
  return { url, publishableKey };
}

export function getOwnerUserId() {
  const ownerUserId = process.env.OWNER_USER_ID;
  if (!ownerUserId) throw new Error("OWNER_USER_ID is not configured.");
  return ownerUserId;
}

export function getConsultationSupabaseEnvironment() {
  const { url } = getSupabaseEnvironment();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("Consultation Supabase access is not configured.");
  }
  return { url, serviceRoleKey };
}
