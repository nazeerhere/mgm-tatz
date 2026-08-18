"use server";

import { randomUUID } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import {
  BULK_DRAFT_DESCRIPTION,
  buildStorageKey,
  hasValidImageSignature,
  parseHomepageDrawingSlot,
  parseHomepageSlot,
  type BulkDraftActionResult,
  validatePortfolioInput,
  validatePortfolioMetadata,
} from "@/lib/portfolio";

type PortfolioDraftInput = ReturnType<typeof validatePortfolioInput>;

async function persistPortfolioDraft(
  supabase: SupabaseClient,
  input: PortfolioDraftInput,
) {
  const imageBytes = new Uint8Array(await input.image.arrayBuffer());
  if (!hasValidImageSignature(imageBytes, input.image.type))
    throw new Error("Image content does not match its file type.");

  const itemId = randomUUID();
  const mediaId = randomUUID();
  const storageKey = buildStorageKey(itemId, mediaId, input.image.type);
  const { error: uploadError } = await supabase.storage
    .from("portfolio-drafts")
    .upload(storageKey, imageBytes, {
      contentType: input.image.type,
      upsert: false,
    });
  if (uploadError) throw new Error("Image upload failed.");

  const { error: itemError } = await supabase.from("portfolio_items").insert({
    id: itemId,
    title: input.title,
    type: input.type,
    description: input.description,
    body_placement: input.bodyPlacement,
    featured: false,
    available: false,
    published: false,
    show_in_gallery: true,
    homepage_order: null,
  });
  if (itemError) {
    await supabase.storage.from("portfolio-drafts").remove([storageKey]);
    throw new Error("Metadata could not be saved.");
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
    throw new Error("Media metadata could not be saved.");
  }

  return itemId;
}

function errorMessage(error: unknown, fallback = "Portfolio update failed.") {
  return error instanceof Error ? error.message : fallback;
}

function portfolioItemPath(itemId: string) {
  return `/admin/portfolio/${encodeURIComponent(itemId)}`;
}

async function savePlacement(
  itemId: string,
  showInGallery: boolean,
  homepageOrder: number | null,
) {
  const { supabase } = await requireOwner();
  return supabase.rpc("set_portfolio_placement", {
    target_item_id: itemId,
    gallery_visible: showInGallery,
    target_homepage_order: homepageOrder,
  });
}

function revalidatePortfolioSurfaces() {
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
  revalidatePath("/admin/homepage");
  revalidatePath("/admin/gallery");
}

export async function createPortfolioItem(formData: FormData) {
  const { supabase } = await requireOwner();
  let error: string | null = null;
  try {
    const input = validatePortfolioInput(formData);
    await persistPortfolioDraft(supabase, input);
  } catch (caught) {
    error = errorMessage(caught, "Invalid submission.");
  }

  if (error)
    redirect(`/admin/portfolio/new?error=${encodeURIComponent(error)}`);
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio?saved=1");
}

export async function createBulkPortfolioDraft(
  formData: FormData,
): Promise<BulkDraftActionResult> {
  const { supabase } = await requireOwner();
  try {
    formData.set("description", BULK_DRAFT_DESCRIPTION);
    formData.set("bodyPlacement", "");
    const input = validatePortfolioInput(formData);
    const itemId = await persistPortfolioDraft(supabase, input);
    revalidatePath("/admin");
    return {
      status: "success",
      message:
        "Private draft uploaded. Edit its description before publishing.",
      itemId,
    };
  } catch (error) {
    return { status: "error", message: errorMessage(error) };
  }
}

export async function publishPortfolioItem(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const { supabase } = await requireOwner();
  const { data: item } = await supabase
    .from("portfolio_items")
    .select(
      "id,published,description,portfolio_media!inner(id,storage_bucket,storage_key,mime_type,is_primary)",
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
    redirect("/admin/portfolio?error=Item%20cannot%20be%20published.");
  if (item.description === BULK_DRAFT_DESCRIPTION)
    redirect(
      `${portfolioItemPath(itemId)}?error=Add%20an%20approved%20description%20before%20publishing.`,
    );
  const { data: draft, error: downloadError } = await supabase.storage
    .from("portfolio-drafts")
    .download(media.storage_key);
  if (downloadError)
    redirect("/admin/portfolio?error=Draft%20image%20could%20not%20be%20read.");
  const publicKey = media.storage_key;
  const { error: publicUploadError } = await supabase.storage
    .from("portfolio-media")
    .upload(publicKey, draft, { contentType: media.mime_type, upsert: false });
  if (publicUploadError)
    redirect(
      "/admin/portfolio?error=Public%20image%20could%20not%20be%20created.",
    );
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
    redirect(
      "/admin/portfolio?error=Publishing%20could%20not%20be%20completed.",
    );
  }
  await supabase.storage.from("portfolio-drafts").remove([media.storage_key]);
  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio?published=1");
}

export async function updatePortfolioMetadata(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  let metadata;
  try {
    metadata = validatePortfolioMetadata(formData);
  } catch (error) {
    redirect(
      `${portfolioItemPath(itemId)}?error=${encodeURIComponent(errorMessage(error))}`,
    );
  }

  const { supabase } = await requireOwner();
  const { error: itemError } = await supabase
    .from("portfolio_items")
    .update({
      title: metadata.title,
      type: metadata.type,
      description: metadata.description,
      body_placement: metadata.bodyPlacement,
    })
    .eq("id", itemId);
  if (itemError)
    redirect(
      `${portfolioItemPath(itemId)}?error=Portfolio%20metadata%20could%20not%20be%20updated.`,
    );

  const { error: mediaError } = await supabase
    .from("portfolio_media")
    .update({ alt_text: metadata.altText })
    .eq("portfolio_item_id", itemId)
    .eq("is_primary", true);
  if (mediaError)
    redirect(
      `${portfolioItemPath(itemId)}?error=Image%20description%20could%20not%20be%20updated.`,
    );

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio?updated=1");
}

export async function updatePortfolioPlacement(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  let homepageOrder;
  try {
    homepageOrder = parseHomepageSlot(formData.get("homepageOrder"));
  } catch (error) {
    redirect(`/admin?error=${encodeURIComponent(errorMessage(error))}`);
  }

  const { supabase } = await requireOwner();
  const { error } = await supabase.rpc("set_portfolio_placement", {
    target_item_id: itemId,
    gallery_visible: formData.get("showInGallery") === "on",
    target_homepage_order: homepageOrder,
  });
  if (error)
    redirect(
      "/admin?error=Placement%20could%20not%20be%20updated.%20Confirm%20the%20item%20is%20published.",
    );

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin");
  redirect("/admin?placement=1");
}

export async function updateHomepagePlacement(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  let homepageOrder;
  try {
    homepageOrder = parseHomepageSlot(formData.get("homepageOrder"));
  } catch (error) {
    redirect(
      `/admin/homepage?error=${encodeURIComponent(errorMessage(error))}`,
    );
  }

  const { supabase } = await requireOwner();
  const { data: item } = await supabase
    .from("portfolio_items")
    .select("show_in_gallery,published")
    .eq("id", itemId)
    .single();
  if (!item?.published)
    redirect(
      "/admin/homepage?error=Only%20published%20work%20can%20be%20assigned.",
    );

  const { error } = await savePlacement(
    itemId,
    item.show_in_gallery,
    homepageOrder,
  );
  if (error)
    redirect(
      "/admin/homepage?error=Homepage%20placement%20could%20not%20be%20updated.",
    );

  revalidatePortfolioSurfaces();
  redirect("/admin/homepage?updated=1");
}

export async function updateHomepageDrawingPlacement(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  let drawingOrder;
  try {
    drawingOrder = parseHomepageDrawingSlot(formData.get("drawingOrder"));
  } catch (error) {
    redirect(
      `/admin/homepage?drawingsError=${encodeURIComponent(errorMessage(error))}`,
    );
  }

  const { supabase } = await requireOwner();
  const { error } = await supabase.rpc("set_homepage_drawing_placement", {
    target_item_id: itemId,
    target_drawing_order: drawingOrder,
  });
  if (error)
    redirect(
      "/admin/homepage?drawingsError=Drawings%20rail%20placement%20could%20not%20be%20updated.",
    );

  revalidatePath("/");
  revalidatePath("/admin/homepage");
  redirect("/admin/homepage?drawingsUpdated=1");
}

export async function updateGalleryVisibility(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const visible = formData.get("visible") === "true";
  const { supabase } = await requireOwner();
  const { data: item } = await supabase
    .from("portfolio_items")
    .select("published,featured,homepage_order")
    .eq("id", itemId)
    .single();
  if (!item?.published)
    redirect(
      "/admin/gallery?error=Only%20published%20work%20can%20be%20added.",
    );

  const { error } = await savePlacement(
    itemId,
    visible,
    item.featured ? item.homepage_order : null,
  );
  if (error)
    redirect(
      "/admin/gallery?error=Gallery%20visibility%20could%20not%20be%20updated.",
    );

  revalidatePortfolioSurfaces();
  redirect("/admin/gallery?updated=1");
}

export async function unpublishPortfolioItem(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const { supabase } = await requireOwner();
  const { data: item } = await supabase
    .from("portfolio_items")
    .select(
      "id,published,featured,homepage_order,portfolio_media!inner(id,storage_bucket,storage_key,mime_type,is_primary)",
    )
    .eq("id", itemId)
    .eq("portfolio_media.is_primary", true)
    .single();
  const media = item?.portfolio_media?.[0];
  if (
    !item ||
    !media ||
    !item.published ||
    media.storage_bucket !== "portfolio-media"
  )
    redirect("/admin/portfolio?error=Item%20cannot%20be%20unpublished.");

  const { data: publicImage, error: downloadError } = await supabase.storage
    .from("portfolio-media")
    .download(media.storage_key);
  if (downloadError)
    redirect(
      "/admin/portfolio?error=Public%20image%20could%20not%20be%20read.",
    );

  const { error: draftUploadError } = await supabase.storage
    .from("portfolio-drafts")
    .upload(media.storage_key, publicImage, {
      contentType: media.mime_type,
      upsert: false,
    });
  if (draftUploadError)
    redirect(
      "/admin/portfolio?error=Private%20draft%20could%20not%20be%20restored.",
    );

  const { error: mediaUpdateError } = await supabase
    .from("portfolio_media")
    .update({ storage_bucket: "portfolio-drafts" })
    .eq("id", media.id);
  if (mediaUpdateError) {
    await supabase.storage.from("portfolio-drafts").remove([media.storage_key]);
    redirect(
      "/admin/portfolio?error=Media%20state%20could%20not%20be%20updated.",
    );
  }

  const { error: itemUpdateError } = await supabase
    .from("portfolio_items")
    .update({ published: false, featured: false, homepage_order: null })
    .eq("id", itemId);
  if (itemUpdateError) {
    await supabase
      .from("portfolio_media")
      .update({ storage_bucket: "portfolio-media" })
      .eq("id", media.id);
    await supabase.storage.from("portfolio-drafts").remove([media.storage_key]);
    redirect("/admin/portfolio?error=Item%20could%20not%20be%20unpublished.");
  }

  const { error: publicRemoveError } = await supabase.storage
    .from("portfolio-media")
    .remove([media.storage_key]);
  if (publicRemoveError) {
    await supabase
      .from("portfolio_items")
      .update({
        published: true,
        featured: item.featured,
        homepage_order: item.homepage_order,
      })
      .eq("id", itemId);
    await supabase
      .from("portfolio_media")
      .update({ storage_bucket: "portfolio-media" })
      .eq("id", media.id);
    await supabase.storage.from("portfolio-drafts").remove([media.storage_key]);
    redirect(
      "/admin/portfolio?error=Public%20media%20could%20not%20be%20removed.",
    );
  }

  revalidatePath("/");
  revalidatePath("/work");
  revalidatePath("/admin");
  revalidatePath("/admin/portfolio");
  redirect("/admin/portfolio?unpublished=1");
}
