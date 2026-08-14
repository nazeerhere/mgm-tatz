import { redirect } from "next/navigation";
import { getOwnerUserId, hasSupabaseEnvironment } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function requireOwner() {
  if (!hasSupabaseEnvironment()) redirect("/admin/login");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || data.user.id !== getOwnerUserId())
    redirect("/admin/login");
  return { supabase, user: data.user };
}
