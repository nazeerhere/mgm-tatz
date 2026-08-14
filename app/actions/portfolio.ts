"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import {
  buildStorageKey,
  hasValidImageSignature,
  validatePortfolioInput,
} from "@/lib/portfolio";

export async function createPortfolioItem(formData: FormData) {
  let input;
  try {
    input = validatePortfolioInput(formData);
  } catch (error) {
    redirect(
      `/admin/portfolio/new?error=${encodeURIComponent(error instanceof Error ? error.message : "Invalid submission.")}`,
    );
  }
  const { supabase } = await requireOwner();
  const imageBytes = new Uint8Array(await input.image.arrayBuffer());
  if (!hasValidImageSignature(imageBytes, input.image.type))
    redirect(
      "/admin/portfolio/new?error=Image%20content%20does%20not%20match%20its%20file%20type.",
    );
  const itemId = randomUUID();
  const mediaId = randomUUID();
  const storageKey = buildStorageKey(itemId, mediaId, input.image.type);
  const { error: uploadError } = await supabase.storage
    .from("portfolio-drafts")
    .upload(storageKey, imageBytes, {
      contentType: input.image.type,
      upsert: false,
    });
  if (uploadError)
    redirect("/admin/portfolio/new?error=Image%20upload%20failed.");

  const { error: itemError } = await supabase.from("portfolio_items").insert({
    id: itemId,
    title: input.title,
    type: input.type,
    description: input.description,
    body_placement: input.bodyPlacement,
    featured: formData.get("featured") === "on",
    available: formData.get("available") === "on",
    published: false,
  });
  if (itemError) {
    await supabase.storage.from("portfolio-drafts").remove([storageKey]);
    redirect("/admin/portfolio/new?error=Metadata%20could%20not%20be%20saved.");
  }
  const { error: mediaError } = await supabase.from("portfolio_media").insert({
    id: mediaId,
    portfolio_item_id: itemId,
    storage_bucket: "portfolio-drafts",
    storage_key: storageKey,
    alt_text: input.altText,
    mime_type: input.image.type,
    is_primary: true,
  });
  if (mediaError) {
    await supabase.from("portfolio_items").delete().eq("id", itemId);
    await supabase.storage.from("portfolio-drafts").remove([storageKey]);
    redirect(
      "/admin/portfolio/new?error=Media%20metadata%20could%20not%20be%20saved.",
    );
  }
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}

export async function publishPortfolioItem(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const { supabase } = await requireOwner();
  const { data: item } = await supabase
    .from("portfolio_items")
    .select(
      "id,published,portfolio_media!inner(id,storage_bucket,storage_key,mime_type,is_primary)",
    )
    .eq("id", itemId)
    .eq("portfolio_media.is_primary", true)
    .single();
  const media = item?.portfolio_media?.[0];
  if (
    !item ||
    !media ||
    item.published ||
    media.storage_bucket !== "portfolio-drafts"
  )
    redirect("/admin?error=Item%20cannot%20be%20published.");
  const { data: draft, error: downloadError } = await supabase.storage
    .from("portfolio-drafts")
    .download(media.storage_key);
  if (downloadError)
    redirect("/admin?error=Draft%20image%20could%20not%20be%20read.");
  const publicKey = media.storage_key;
  const { error: publicUploadError } = await supabase.storage
    .from("portfolio-media")
    .upload(publicKey, draft, { contentType: media.mime_type, upsert: false });
  if (publicUploadError)
    redirect("/admin?error=Public%20image%20could%20not%20be%20created.");
  const { error: mediaUpdateError } = await supabase
    .from("portfolio_media")
    .update({ storage_bucket: "portfolio-media", storage_key: publicKey })
    .eq("id", media.id);
  const { error: publishError } = mediaUpdateError
    ? { error: mediaUpdateError }
    : await supabase
        .from("portfolio_items")
        .update({ published: true })
        .eq("id", itemId);
  if (publishError) {
    if (!mediaUpdateError)
      await supabase
        .from("portfolio_media")
        .update({
          storage_bucket: "portfolio-drafts",
          storage_key: media.storage_key,
        })
        .eq("id", media.id);
    await supabase.storage.from("portfolio-media").remove([publicKey]);
    redirect("/admin?error=Publishing%20could%20not%20be%20completed.");
  }
  await supabase.storage.from("portfolio-drafts").remove([media.storage_key]);
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin");
  redirect("/admin?published=1");
}
