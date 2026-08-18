"use server";

import { randomUUID } from "node:crypto";
import {
  ConsultationConfigurationError,
  ConsultationPersistenceError,
  ConsultationValidationError,
  consultationBucket,
  consultationStorageExtension,
  type ConsultationActionState,
  validateConsultationImageSignatures,
  validateConsultationInput,
} from "@/lib/consultation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function submitConsultationRequest(
  formData: FormData,
): Promise<ConsultationActionState> {
  if (String(formData.get("website") ?? "")) {
    return {
      status: "success",
      message: "Thanks — your project details have been received.",
    };
  }

  try {
    const input = validateConsultationInput(formData);
    await validateConsultationImageSignatures([
      ...input.referenceImages.map((file) => ({
        file,
        field: "referenceImages" as const,
      })),
      ...(input.bodyAreaImage
        ? [{ file: input.bodyAreaImage, field: "bodyAreaImage" as const }]
        : []),
    ]);

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
      throw new ConsultationConfigurationError();

    const supabase = createAdminClient();
    const requestId = randomUUID();
    const { error: requestError } = await supabase
      .from("consultation_requests")
      .insert({
        id: requestId,
        full_name: input.fullName,
        email: input.email,
        phone: input.phone,
        location: input.location,
        tattoo_idea: input.tattooIdea,
        desired_placement: input.desiredPlacement,
        approximate_size: input.approximateSize,
        preferred_style: input.preferredStyle,
        color_preference: input.colorPreference,
        project_type: input.projectType,
        artistic_interpretation: input.artisticInterpretation,
        preferred_timeframe: input.preferredTimeframe,
        avoid_notes: input.avoidNotes,
        additional_notes: input.additionalNotes,
      });
    if (requestError) throw new ConsultationPersistenceError();

    const uploadedKeys: string[] = [];
    const mediaRows: Array<{
      id: string;
      consultation_request_id: string;
      kind: "reference" | "body_area";
      storage_bucket: string;
      storage_key: string;
      mime_type: string;
      byte_size: number;
      display_order: number;
    }> = [];
    const files = [
      ...input.referenceImages.map((file, index) => ({
        file,
        kind: "reference" as const,
        displayOrder: index,
      })),
      ...(input.bodyAreaImage
        ? [
            {
              file: input.bodyAreaImage,
              kind: "body_area" as const,
              displayOrder: 0,
            },
          ]
        : []),
    ];

    try {
      for (const { file, kind, displayOrder } of files) {
        const mediaId = randomUUID();
        const storageKey = `consultations/${requestId}/${mediaId}.${consultationStorageExtension(file.type)}`;
        const imageBytes = new Uint8Array(await file.arrayBuffer());
        const { error: uploadError } = await supabase.storage
          .from(consultationBucket)
          .upload(storageKey, imageBytes, {
            contentType: file.type,
            upsert: false,
          });
        if (uploadError) throw new ConsultationPersistenceError();
        uploadedKeys.push(storageKey);
        mediaRows.push({
          id: mediaId,
          consultation_request_id: requestId,
          kind,
          storage_bucket: consultationBucket,
          storage_key: storageKey,
          mime_type: file.type,
          byte_size: file.size,
          display_order: displayOrder,
        });
      }

      if (mediaRows.length) {
        const { error: mediaError } = await supabase
          .from("consultation_request_media")
          .insert(mediaRows);
        if (mediaError) throw new ConsultationPersistenceError();
      }
    } catch {
      if (uploadedKeys.length)
        await supabase.storage.from(consultationBucket).remove(uploadedKeys);
      await supabase.from("consultation_requests").delete().eq("id", requestId);
      throw new ConsultationPersistenceError();
    }

    return {
      status: "success",
      message: "Thanks — your project details have been received.",
      requestId,
    };
  } catch (error) {
    if (error instanceof ConsultationValidationError) {
      return {
        status: "error",
        message: "Take another look at the highlighted field.",
        fieldErrors: { [error.field]: error.message },
      };
    }
    if (error instanceof ConsultationConfigurationError) {
      return {
        status: "error",
        message:
          "Consultation requests are not available yet. Please try again later.",
      };
    }
    return {
      status: "error",
      message:
        "Your request could not be sent right now. Please try again later.",
    };
  }
}
