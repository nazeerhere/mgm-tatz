import { faqItems as fallbackFaqItems } from "@/content/site-content";
import { hasSupabaseEnvironment } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export function validateFaqInput(formData: FormData) {
  const question = String(formData.get("question") ?? "").trim();
  const answer = String(formData.get("answer") ?? "").trim();
  const rawDisplayOrder = formData.get("displayOrder");
  const displayOrder = Number(rawDisplayOrder);
  const isActive = formData.get("isActive") === "on";

  if (question.length < 5 || question.length > 200)
    throw new Error("Question must be 5–200 characters.");
  if (answer.length < 5 || answer.length > 2000)
    throw new Error("Answer must be 5–2,000 characters.");
  if (
    rawDisplayOrder === null ||
    rawDisplayOrder === "" ||
    !Number.isInteger(displayOrder) ||
    displayOrder < 0 ||
    displayOrder > 10000
  )
    throw new Error("Display order must be a whole number from 0–10,000.");

  return { question, answer, displayOrder, isActive };
}

export async function getActiveFaqItems() {
  if (!hasSupabaseEnvironment())
    return fallbackFaqItems.map((item, index) => ({
      id: `fallback-${index}`,
      ...item,
      display_order: index,
      is_active: true,
    }));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("faqs")
    .select("id,question,answer,display_order,is_active")
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error)
    return fallbackFaqItems.map((item, index) => ({
      id: `fallback-${index}`,
      ...item,
      display_order: index,
      is_active: true,
    }));
  return (data ?? []) as FaqItem[];
}
