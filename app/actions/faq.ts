"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { validateFaqInput } from "@/lib/faq";

function faqError(error: unknown) {
  return error instanceof Error ? error.message : "FAQ update failed.";
}

function refreshFaq() {
  revalidatePath("/faq");
  revalidatePath("/admin");
  revalidatePath("/admin/faq");
}

export async function createFaq(formData: FormData) {
  let input;
  try {
    input = validateFaqInput(formData);
  } catch (error) {
    redirect(`/admin/faq?error=${encodeURIComponent(faqError(error))}`);
  }
  const { supabase } = await requireOwner();
  const { error } = await supabase.from("faqs").insert({
    question: input.question,
    answer: input.answer,
    display_order: input.displayOrder,
    is_active: input.isActive,
  });
  if (error) redirect("/admin/faq?error=FAQ%20could%20not%20be%20created.");
  refreshFaq();
  redirect("/admin/faq?created=1");
}

export async function updateFaq(formData: FormData) {
  const faqId = String(formData.get("faqId") ?? "");
  let input;
  try {
    input = validateFaqInput(formData);
  } catch (error) {
    redirect(`/admin/faq?error=${encodeURIComponent(faqError(error))}`);
  }
  const { supabase } = await requireOwner();
  const { error } = await supabase
    .from("faqs")
    .update({
      question: input.question,
      answer: input.answer,
      display_order: input.displayOrder,
      is_active: input.isActive,
    })
    .eq("id", faqId);
  if (error) redirect("/admin/faq?error=FAQ%20could%20not%20be%20updated.");
  refreshFaq();
  redirect("/admin/faq?updated=1");
}

export async function deleteFaq(formData: FormData) {
  const faqId = String(formData.get("faqId") ?? "");
  if (formData.get("confirmDelete") !== "on")
    redirect(
      "/admin/faq?error=Confirm%20the%20FAQ%20deletion%20before%20continuing.",
    );
  const { supabase } = await requireOwner();
  const { error } = await supabase.from("faqs").delete().eq("id", faqId);
  if (error) redirect("/admin/faq?error=FAQ%20could%20not%20be%20deleted.");
  refreshFaq();
  redirect("/admin/faq?deleted=1");
}
