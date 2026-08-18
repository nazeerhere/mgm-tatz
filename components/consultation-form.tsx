"use client";

import Image from "next/image";
import {
  type FormEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { submitConsultationRequest } from "@/app/actions/consultation";
import {
  colorPreferences,
  consultationImageTypes,
  consultationSizes,
  consultationStyles,
  interpretationPreferences,
  maxReferenceImages,
  projectTypes,
  type ConsultationActionState,
  type ConsultationField,
} from "@/lib/consultation";

const initialState: ConsultationActionState = { status: "idle", message: "" };

type Preview = {
  id: string;
  name: string;
  url: string;
};

function previewId(file: File, index: number) {
  return `${file.name}-${file.size}-${file.lastModified}-${index}`;
}

function FieldError({
  state,
  field,
}: {
  state: ConsultationActionState;
  field: ConsultationField;
}) {
  const error = state.fieldErrors?.[field];
  return error ? (
    <span className="consultation-field-error" id={`${field}-error`}>
      {error}
    </span>
  ) : null;
}

function FormSection({
  number,
  title,
  description,
  children,
}: {
  number: string;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  const headingId = `consultation-section-${number}`;
  return (
    <section className="consultation-form-section" aria-labelledby={headingId}>
      <header className="consultation-section-heading">
        <span>{number}</span>
        <div>
          <h3 id={headingId}>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
      </header>
      <div className="consultation-section-fields">{children}</div>
    </section>
  );
}

export function ConsultationForm() {
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const bodyInputRef = useRef<HTMLInputElement>(null);
  const acknowledgementRef = useRef<HTMLInputElement>(null);
  const previewUrls = useRef<string[]>([]);
  const [referencePreviews, setReferencePreviews] = useState<Preview[]>([]);
  const [bodyPreview, setBodyPreview] = useState<Preview | null>(null);
  const [acknowledgementError, setAcknowledgementError] = useState(false);
  const [state, setState] = useState(initialState);
  const [pending, startTransition] = useTransition();

  useEffect(
    () => () => {
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  function releasePreviews(previews: Preview[]) {
    previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    const released = new Set(previews.map((preview) => preview.url));
    previewUrls.current = previewUrls.current.filter(
      (url) => !released.has(url),
    );
  }

  function replaceReferencePreviews(files: FileList | null) {
    releasePreviews(referencePreviews);
    const previews = Array.from(files ?? []).map((file, index) => ({
      id: previewId(file, index),
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    previewUrls.current.push(...previews.map((preview) => preview.url));
    setReferencePreviews(previews);
  }

  function replaceBodyPreview(files: FileList | null) {
    if (bodyPreview) releasePreviews([bodyPreview]);
    const file = files?.[0];
    const preview = file
      ? {
          id: previewId(file, 0),
          name: file.name,
          url: URL.createObjectURL(file),
        }
      : null;
    if (preview) previewUrls.current.push(preview.url);
    setBodyPreview(preview);
  }

  function removeReference(id: string) {
    const input = referenceInputRef.current;
    if (!input?.files) return;
    const retainedFiles = Array.from(input.files).filter(
      (file, index) => previewId(file, index) !== id,
    );
    const transfer = new DataTransfer();
    retainedFiles.forEach((file) => transfer.items.add(file));
    input.files = transfer.files;
    replaceReferencePreviews(input.files);
  }

  function removeBodyPreview() {
    if (bodyInputRef.current) bodyInputRef.current.value = "";
    replaceBodyPreview(null);
  }

  function fieldInvalid(field: ConsultationField) {
    return Boolean(state.fieldErrors?.[field]);
  }

  function describedBy(field: ConsultationField, hintId?: string) {
    return [hintId, fieldInvalid(field) ? `${field}-error` : null]
      .filter(Boolean)
      .join(" ");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const hasOtherInvalidControl = Array.from(form.elements).some(
      (control) =>
        (control instanceof HTMLInputElement ||
          control instanceof HTMLSelectElement ||
          control instanceof HTMLTextAreaElement) &&
        control !== acknowledgementRef.current &&
        !control.checkValidity(),
    );

    if (
      formData.get("consultationAcknowledgement") !== "confirmed" &&
      !hasOtherInvalidControl
    ) {
      setState(initialState);
      setAcknowledgementError(true);
      acknowledgementRef.current?.focus();
      return;
    }

    setAcknowledgementError(false);
    const instagram = String(formData.get("instagram") ?? "").trim();
    const additionalNotes = String(
      formData.get("additionalNotesDraft") ?? "",
    ).trim();
    formData.delete("instagram");
    formData.delete("additionalNotesDraft");
    formData.delete("consultationAcknowledgement");
    formData.set(
      "additionalNotes",
      [instagram ? `Instagram: ${instagram}` : "", additionalNotes]
        .filter(Boolean)
        .join("\n\n"),
    );

    startTransition(async () => {
      const result = await submitConsultationRequest(formData);
      setState(result);
      if (result.status === "success") {
        form.reset();
        releasePreviews(referencePreviews);
        if (bodyPreview) releasePreviews([bodyPreview]);
        setReferencePreviews([]);
        setBodyPreview(null);
      }
    });
  }

  if (state.status === "success") {
    return (
      <div className="consultation-confirmation" role="status">
        <p className="kicker">Request received</p>
        <h2>Thanks — your project details have been received.</h2>
        <p>
          This confirms your request only; no appointment has been booked yet.
          Scheduling remains a separate next step.
        </p>
      </div>
    );
  }

  return (
    <form className="consultation-form" onSubmit={submit} noValidate>
      {state.status === "error" ? (
        <p className="consultation-form-message error" role="alert">
          {state.message}
        </p>
      ) : null}

      <FormSection number="01" title="Contact details">
        <label className="consultation-field consultation-field-required">
          <span>
            Full name <b aria-hidden="true">*</b>
          </span>
          <input
            name="fullName"
            required
            autoComplete="name"
            maxLength={100}
            placeholder="e.g. Alex Morgan"
            aria-invalid={fieldInvalid("fullName")}
            aria-describedby={describedBy("fullName") || undefined}
          />
          <FieldError state={state} field="fullName" />
        </label>

        <label className="consultation-field consultation-field-required">
          <span>
            Email address <b aria-hidden="true">*</b>
          </span>
          <input
            name="email"
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            placeholder="you@example.com"
            aria-invalid={fieldInvalid("email")}
            aria-describedby={describedBy("email") || undefined}
          />
          <FieldError state={state} field="email" />
        </label>

        <label className="consultation-field">
          <span>
            Phone <em>Optional</em>
          </span>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            maxLength={40}
            placeholder="e.g. +1 (555) 123-4567"
            aria-invalid={fieldInvalid("phone")}
            aria-describedby={describedBy("phone") || undefined}
          />
          <FieldError state={state} field="phone" />
        </label>

        <label className="consultation-field">
          <span>
            Instagram <em>Optional</em>
          </span>
          <input
            name="instagram"
            maxLength={80}
            placeholder="@yourhandle"
            autoCapitalize="none"
          />
        </label>

        <label className="consultation-field consultation-field-required consultation-field-wide">
          <span>
            Where are you located? <b aria-hidden="true">*</b>
          </span>
          <input
            name="location"
            required
            autoComplete="address-level2"
            maxLength={120}
            placeholder="Chicago, IL"
            aria-invalid={fieldInvalid("location")}
            aria-describedby={describedBy("location") || undefined}
          />
          <FieldError state={state} field="location" />
        </label>
      </FormSection>

      <FormSection number="02" title="Your idea">
        <label className="consultation-field consultation-field-required consultation-field-wide">
          <span>
            Tell me about your idea <b aria-hidden="true">*</b>
          </span>
          <small id="tattoo-idea-hint">
            Subject, symbolism, mood, references, or creative freedom are all
            welcome.
          </small>
          <textarea
            name="tattooIdea"
            required
            rows={6}
            maxLength={2000}
            placeholder="Share the story, feeling, or visual direction you are imagining."
            aria-invalid={fieldInvalid("tattooIdea")}
            aria-describedby={describedBy("tattooIdea", "tattoo-idea-hint")}
          />
          <FieldError state={state} field="tattooIdea" />
        </label>

        <label className="consultation-field consultation-field-required">
          <span>
            Placement on the body <b aria-hidden="true">*</b>
          </span>
          <input
            name="desiredPlacement"
            required
            maxLength={120}
            placeholder="Forearm, upper back, calf"
            aria-invalid={fieldInvalid("desiredPlacement")}
            aria-describedby={describedBy("desiredPlacement") || undefined}
          />
          <FieldError state={state} field="desiredPlacement" />
        </label>

        <label className="consultation-field consultation-field-required">
          <span>
            Approximate size <b aria-hidden="true">*</b>
          </span>
          <select
            name="approximateSize"
            required
            defaultValue=""
            aria-invalid={fieldInvalid("approximateSize")}
            aria-describedby={describedBy("approximateSize") || undefined}
          >
            <option value="" disabled>
              Choose one
            </option>
            {consultationSizes.map((size) => (
              <option value={size} key={size}>
                {size}
              </option>
            ))}
          </select>
          <FieldError state={state} field="approximateSize" />
        </label>

        <label className="consultation-field consultation-field-required consultation-field-wide">
          <span>
            New tattoo, cover-up, or rework? <b aria-hidden="true">*</b>
          </span>
          <select
            name="projectType"
            required
            defaultValue=""
            aria-invalid={fieldInvalid("projectType")}
            aria-describedby={describedBy("projectType") || undefined}
          >
            <option value="" disabled>
              Choose one
            </option>
            {projectTypes.map((type) => (
              <option value={type} key={type}>
                {type}
              </option>
            ))}
          </select>
          <FieldError state={state} field="projectType" />
        </label>
      </FormSection>

      <FormSection number="03" title="Preferences">
        <label className="consultation-field consultation-field-required">
          <span>
            Preferred month / ideal timing <b aria-hidden="true">*</b>
          </span>
          <input
            name="preferredTimeframe"
            required
            maxLength={100}
            placeholder="October, winter, or flexible"
            aria-invalid={fieldInvalid("preferredTimeframe")}
            aria-describedby={describedBy("preferredTimeframe") || undefined}
          />
          <FieldError state={state} field="preferredTimeframe" />
        </label>

        <label className="consultation-field consultation-field-required">
          <span>
            Style / influences <b aria-hidden="true">*</b>
          </span>
          <select
            name="preferredStyle"
            required
            defaultValue=""
            aria-invalid={fieldInvalid("preferredStyle")}
            aria-describedby={describedBy("preferredStyle") || undefined}
          >
            <option value="" disabled>
              Choose one
            </option>
            {consultationStyles.map((style) => (
              <option value={style} key={style}>
                {style}
              </option>
            ))}
          </select>
          <FieldError state={state} field="preferredStyle" />
        </label>

        <label className="consultation-field consultation-field-required">
          <span>
            Color preference <b aria-hidden="true">*</b>
          </span>
          <select
            name="colorPreference"
            required
            defaultValue=""
            aria-invalid={fieldInvalid("colorPreference")}
            aria-describedby={describedBy("colorPreference") || undefined}
          >
            <option value="" disabled>
              Choose one
            </option>
            {colorPreferences.map((preference) => (
              <option value={preference} key={preference}>
                {preference}
              </option>
            ))}
          </select>
          <FieldError state={state} field="colorPreference" />
        </label>

        <label className="consultation-field consultation-field-required">
          <span>
            Flexibility / artist direction <b aria-hidden="true">*</b>
          </span>
          <select
            name="artisticInterpretation"
            required
            defaultValue=""
            aria-invalid={fieldInvalid("artisticInterpretation")}
            aria-describedby={
              describedBy("artisticInterpretation") || undefined
            }
          >
            <option value="" disabled>
              Choose the closest fit
            </option>
            {interpretationPreferences.map((preference) => (
              <option value={preference} key={preference}>
                {preference}
              </option>
            ))}
          </select>
          <FieldError state={state} field="artisticInterpretation" />
        </label>
      </FormSection>

      <FormSection
        number="04"
        title="References & uploads"
        description="References help clarify the visual direction and available placement."
      >
        <div className="consultation-field consultation-upload">
          <label htmlFor="reference-images">
            <span>
              Reference pictures <em>Optional</em>
            </span>
            <small id="reference-images-hint">
              Add inspiration or sketches. Up to {maxReferenceImages} JPEG, PNG,
              or WebP files; 5 MB each.
            </small>
          </label>
          <input
            id="reference-images"
            name="referenceImages"
            ref={referenceInputRef}
            type="file"
            accept={consultationImageTypes.join(",")}
            multiple
            aria-invalid={fieldInvalid("referenceImages")}
            aria-describedby={describedBy(
              "referenceImages",
              "reference-images-hint",
            )}
            onChange={(event) =>
              replaceReferencePreviews(event.currentTarget.files)
            }
          />
          <FieldError state={state} field="referenceImages" />
          {referencePreviews.length ? (
            <div
              className="consultation-previews"
              aria-label="Selected references"
            >
              {referencePreviews.map((preview) => (
                <figure key={preview.id}>
                  <Image
                    src={preview.url}
                    alt=""
                    fill
                    unoptimized
                    sizes="8rem"
                  />
                  <figcaption>{preview.name}</figcaption>
                  <button
                    type="button"
                    onClick={() => removeReference(preview.id)}
                    aria-label={`Remove ${preview.name}`}
                  >
                    Remove
                  </button>
                </figure>
              ))}
            </div>
          ) : null}
        </div>

        <div className="consultation-field consultation-upload">
          <label htmlFor="body-area-image">
            <span>
              Picture of the area <em>Optional, encouraged</em>
            </span>
            <small id="body-area-image-hint">
              A clear body-area photo helps assess shape and placement. JPEG,
              PNG, or WebP; 5 MB maximum.
            </small>
          </label>
          <input
            id="body-area-image"
            name="bodyAreaImage"
            ref={bodyInputRef}
            type="file"
            accept={consultationImageTypes.join(",")}
            aria-invalid={fieldInvalid("bodyAreaImage")}
            aria-describedby={describedBy(
              "bodyAreaImage",
              "body-area-image-hint",
            )}
            onChange={(event) => replaceBodyPreview(event.currentTarget.files)}
          />
          <FieldError state={state} field="bodyAreaImage" />
          {bodyPreview ? (
            <div
              className="consultation-previews single"
              aria-label="Selected body-area photo"
            >
              <figure>
                <Image
                  src={bodyPreview.url}
                  alt=""
                  fill
                  unoptimized
                  sizes="8rem"
                />
                <figcaption>{bodyPreview.name}</figcaption>
                <button type="button" onClick={removeBodyPreview}>
                  Remove
                </button>
              </figure>
            </div>
          ) : null}
        </div>
      </FormSection>

      <FormSection number="05" title="Final notes">
        <label className="consultation-field consultation-field-wide">
          <span>
            Anything you definitely want avoided? <em>Optional</em>
          </span>
          <textarea
            name="avoidNotes"
            rows={3}
            maxLength={1000}
            aria-invalid={fieldInvalid("avoidNotes")}
            aria-describedby={describedBy("avoidNotes") || undefined}
          />
          <FieldError state={state} field="avoidNotes" />
        </label>

        <label className="consultation-field consultation-field-wide">
          <span>
            Anything else I should know? <em>Optional</em>
          </span>
          <textarea
            name="additionalNotesDraft"
            rows={4}
            maxLength={850}
            placeholder="Share any other context that would help with the review."
            aria-invalid={fieldInvalid("additionalNotes")}
            aria-describedby={describedBy("additionalNotes") || undefined}
          />
          <FieldError state={state} field="additionalNotes" />
        </label>

        <label className="consultation-acknowledgement consultation-field-wide">
          <input
            ref={acknowledgementRef}
            name="consultationAcknowledgement"
            type="checkbox"
            value="confirmed"
            required
            aria-invalid={acknowledgementError}
            aria-describedby={
              acknowledgementError ? "acknowledgement-error" : undefined
            }
            onChange={() => setAcknowledgementError(false)}
          />
          <span>
            I understand this is a consultation request, not a confirmed
            booking.
          </span>
        </label>
        {acknowledgementError ? (
          <span
            className="consultation-field-error consultation-field-wide"
            id="acknowledgement-error"
          >
            Confirm that you understand before submitting.
          </span>
        ) : null}
      </FormSection>

      <label className="consultation-honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="consultation-submit-row">
        <button className="button" type="submit" disabled={pending}>
          {pending ? "Sending request…" : "Submit consultation request"}
          <span aria-hidden="true">→</span>
        </button>
        <p>
          Your details are submitted for private review. This does not book an
          appointment.
        </p>
      </div>
    </form>
  );
}
