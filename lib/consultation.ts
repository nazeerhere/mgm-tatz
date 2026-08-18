import { hasValidImageSignature } from "@/lib/portfolio";

export const consultationSizes = [
  "Small",
  "Palm-sized",
  "Forearm-sized",
  "Large / multi-session",
  "Not sure yet",
] as const;

export const consultationStyles = [
  "Black & grey",
  "Illustrative",
  "Anime / manga",
  "Dark fantasy",
  "Classical",
  "Animals / anatomy",
  "Open to artist direction",
] as const;

export const colorPreferences = [
  "Black & grey",
  "Color",
  "Open to either",
] as const;

export const projectTypes = ["New tattoo", "Cover-up", "Rework"] as const;

export const interpretationPreferences = [
  "Yes — bring your perspective",
  "Somewhat — I have a few must-keep details",
  "Not much — I have a specific direction",
] as const;

export const consultationImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const maxConsultationImageBytes = 5 * 1024 * 1024;
export const maxReferenceImages = 5;
export const consultationBucket = "consultation-intake";

export type ConsultationField =
  | "fullName"
  | "email"
  | "phone"
  | "location"
  | "tattooIdea"
  | "desiredPlacement"
  | "approximateSize"
  | "preferredStyle"
  | "colorPreference"
  | "projectType"
  | "artisticInterpretation"
  | "preferredTimeframe"
  | "referenceImages"
  | "bodyAreaImage"
  | "avoidNotes"
  | "additionalNotes";

export type ConsultationActionState = {
  status: "idle" | "error" | "success";
  message: string;
  fieldErrors?: Partial<Record<ConsultationField, string>>;
  requestId?: string;
};

export class ConsultationValidationError extends Error {
  constructor(
    readonly field: ConsultationField,
    message: string,
  ) {
    super(message);
    this.name = "ConsultationValidationError";
  }
}

export class ConsultationConfigurationError extends Error {
  constructor() {
    super("Consultation persistence is not configured.");
    this.name = "ConsultationConfigurationError";
  }
}

export class ConsultationPersistenceError extends Error {
  constructor() {
    super("Consultation request could not be saved.");
    this.name = "ConsultationPersistenceError";
  }
}

function requiredText(
  formData: FormData,
  field: ConsultationField,
  label: string,
  minimum: number,
  maximum: number,
) {
  const value = String(formData.get(field) ?? "").trim();
  if (value.length < minimum)
    throw new ConsultationValidationError(field, `${label} is required.`);
  if (value.length > maximum)
    throw new ConsultationValidationError(
      field,
      `${label} must be ${maximum} characters or fewer.`,
    );
  return value;
}

function optionalText(
  formData: FormData,
  field: ConsultationField,
  label: string,
  maximum: number,
) {
  const value = String(formData.get(field) ?? "").trim();
  if (value.length > maximum)
    throw new ConsultationValidationError(
      field,
      `${label} must be ${maximum} characters or fewer.`,
    );
  return value || null;
}

function choice<T extends readonly string[]>(
  formData: FormData,
  field: ConsultationField,
  label: string,
  options: T,
) {
  const value = String(formData.get(field) ?? "");
  if (!options.includes(value))
    throw new ConsultationValidationError(field, `Choose ${label}.`);
  return value as T[number];
}

function images(formData: FormData, field: ConsultationField) {
  return formData
    .getAll(field)
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
}

function validateFileShape(file: File, field: ConsultationField) {
  if (file.size > maxConsultationImageBytes)
    throw new ConsultationValidationError(
      field,
      "Each image must be 5 MB or smaller.",
    );
  if (!consultationImageTypes.some((imageType) => imageType === file.type))
    throw new ConsultationValidationError(
      field,
      "Images must be JPEG, PNG, or WebP.",
    );
}

export function validateConsultationInput(formData: FormData) {
  const fullName = requiredText(formData, "fullName", "Full name", 2, 100);
  const email = requiredText(formData, "email", "Email", 3, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new ConsultationValidationError(
      "email",
      "Enter a valid email address.",
    );

  const phone = optionalText(formData, "phone", "Phone number", 40);
  const location = requiredText(formData, "location", "Your location", 2, 120);
  const tattooIdea = requiredText(
    formData,
    "tattooIdea",
    "Your tattoo idea",
    20,
    2000,
  );
  const desiredPlacement = requiredText(
    formData,
    "desiredPlacement",
    "Desired placement",
    2,
    120,
  );
  const approximateSize = choice(
    formData,
    "approximateSize",
    "an approximate size",
    consultationSizes,
  );
  const preferredStyle = choice(
    formData,
    "preferredStyle",
    "a preferred style",
    consultationStyles,
  );
  const colorPreference = choice(
    formData,
    "colorPreference",
    "a color direction",
    colorPreferences,
  );
  const projectType = choice(
    formData,
    "projectType",
    "a project type",
    projectTypes,
  );
  const artisticInterpretation = choice(
    formData,
    "artisticInterpretation",
    "how open you are to artistic interpretation",
    interpretationPreferences,
  );
  const preferredTimeframe = requiredText(
    formData,
    "preferredTimeframe",
    "Preferred timeframe",
    2,
    100,
  );
  const referenceImages = images(formData, "referenceImages");
  if (referenceImages.length > maxReferenceImages)
    throw new ConsultationValidationError(
      "referenceImages",
      `Choose up to ${maxReferenceImages} reference images.`,
    );
  referenceImages.forEach((file) => validateFileShape(file, "referenceImages"));

  const bodyAreaImages = images(formData, "bodyAreaImage");
  if (bodyAreaImages.length > 1)
    throw new ConsultationValidationError(
      "bodyAreaImage",
      "Choose one body-area photo.",
    );
  bodyAreaImages.forEach((file) => validateFileShape(file, "bodyAreaImage"));

  return {
    fullName,
    email,
    phone,
    location,
    tattooIdea,
    desiredPlacement,
    approximateSize,
    preferredStyle,
    colorPreference,
    projectType,
    artisticInterpretation,
    preferredTimeframe,
    referenceImages,
    bodyAreaImage: bodyAreaImages[0] ?? null,
    avoidNotes: optionalText(formData, "avoidNotes", "Designs to avoid", 1000),
    additionalNotes: optionalText(
      formData,
      "additionalNotes",
      "Additional notes",
      1000,
    ),
  };
}

export async function validateConsultationImageSignatures(
  files: Array<{ file: File; field: ConsultationField }>,
) {
  for (const { file, field } of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (!hasValidImageSignature(bytes, file.type))
      throw new ConsultationValidationError(
        field,
        "An image does not match its declared file type.",
      );
  }
}

export function consultationStorageExtension(mimeType: string) {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const extension = extensions[mimeType];
  if (!extension) throw new Error("Unsupported consultation image type.");
  return extension;
}
