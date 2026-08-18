import "server-only";

import { createClient } from "@supabase/supabase-js";
import { getConsultationSupabaseEnvironment } from "@/lib/env";

export function createAdminClient() {
  const { url, serviceRoleKey } = getConsultationSupabaseEnvironment();
  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
