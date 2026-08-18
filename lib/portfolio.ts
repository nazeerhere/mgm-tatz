export const portfolioTypes = [
  "tattoo",
  "drawing",
  "flash",
  "concept",
] as const;
export type PortfolioType = (typeof portfolioTypes)[number];

export type PublishedPortfolioItem = {
  id: string;
  title: string;
  type: PortfolioType;
  description: string;
  body_placement: string | null;
  featured: boolean;
  show_in_gallery: boolean;
  homepage_order: number | null;
  available: boolean;
  display_order: number;
  created_at: string;
  portfolio_item_style_tags: Array<{
    style_tags: { slug: string } | Array<{ slug: string }> | null;
  }>;
  portfolio_media: Array<{
    storage_bucket: string;
    storage_key: string;
    alt_text: string;
    width: number | null;
    height: number | null;
  }>;
};

export const homepageSlots = [1, 2, 3, 4] as const;
export type HomepageSlot = (typeof homepageSlots)[number];

export const BULK_DRAFT_DESCRIPTION =
  "Description pending artist review before publication.";

export type BulkDraftActionResult = {
  status: "success" | "error";
  message: string;
  itemId?: string;
};

export function validatePortfolioMetadata(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "") as PortfolioType;
  const description = String(formData.get("description") ?? "").trim();
  const bodyPlacement = String(formData.get("bodyPlacement") ?? "").trim();
  const altText = String(formData.get("altText") ?? "").trim();

  if (title.length < 2 || title.length > 100)
    throw new Error("Title must be 2–100 characters.");
  if (!portfolioTypes.includes(type))
    throw new Error("Choose a valid work type.");
  if (description.length < 10 || description.length > 800)
    throw new Error("Description must be 10–800 characters.");
  if (bodyPlacement.length > 100)
    throw new Error("Body placement must be 100 characters or fewer.");
  if (altText.length < 5 || altText.length > 180)
    throw new Error("Image description must be 5–180 characters.");

  return {
    title,
    type,
    description,
    bodyPlacement: bodyPlacement || null,
    altText,
  };
}

export function validatePortfolioInput(formData: FormData) {
  const metadata = validatePortfolioMetadata(formData);
  const image = formData.get("image");

  if (!(image instanceof File) || image.size === 0)
    throw new Error("Choose an image.");
  if (image.size > 10 * 1024 * 1024)
    throw new Error("Image must be no more than 10 MB.");
  if (!["image/jpeg", "image/png", "image/webp"].includes(image.type))
    throw new Error("Image must be JPEG, PNG, or WebP.");

  return {
    ...metadata,
    image,
  };
}

export function draftMetadataFromFilename(filename: string) {
  const withoutExtension = filename.replace(/\.[^.]+$/, "");
  const words = withoutExtension
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const title = (words || "Untitled work")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .slice(0, 100);

  return {
    title,
    altText: `${title} portfolio image.`.slice(0, 180),
  };
}

export function parseHomepageSlot(value: FormDataEntryValue | null) {
  if (value === null || value === "") return null;
  const slot = Number(value);
  if (!homepageSlots.includes(slot as HomepageSlot))
    throw new Error("Choose a valid homepage slot.");
  return slot as HomepageSlot;
}

export function parseHomepageDrawingSlot(value: FormDataEntryValue | null) {
  if (value === null || value === "") return null;
  const slot = Number(value);
  if (!homepageSlots.includes(slot as HomepageSlot))
    throw new Error("Choose a valid homepage drawing slot.");
  return slot as HomepageSlot;
}

export function resolveSurfaceVisibility({
  published,
  showInGallery,
  homepageOrder,
}: {
  published: boolean;
  showInGallery: boolean;
  homepageOrder: number | null;
}) {
  return {
    gallery: published && showInGallery,
    homepage: published && homepageOrder !== null,
  };
}

export function extensionForMimeType(mimeType: string) {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const extension = extensions[mimeType];
  if (!extension) throw new Error("Unsupported image type.");
  return extension;
}

export function buildStorageKey(
  itemId: string,
  mediaId: string,
  mimeType: string,
) {
  return `portfolio/${itemId}/${mediaId}.${extensionForMimeType(mimeType)}`;
}

export function hasValidImageSignature(bytes: Uint8Array, mimeType: string) {
  if (mimeType === "image/jpeg")
    return (
      bytes.length >= 3 &&
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  if (mimeType === "image/png")
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (byte, index) => bytes[index] === byte,
    );
  if (mimeType === "image/webp")
    return (
      bytes.length >= 12 &&
      new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
      new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP"
    );
  return false;
}

export function publicMediaUrl(
  supabaseUrl: string,
  bucket: string,
  storageKey: string,
) {
  const base = supabaseUrl.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${encodeURIComponent(bucket)}/${storageKey.split("/").map(encodeURIComponent).join("/")}`;
}
