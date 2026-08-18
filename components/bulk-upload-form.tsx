"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { createBulkPortfolioDraft } from "@/app/actions/portfolio";
import {
  draftMetadataFromFilename,
  portfolioTypes,
  type BulkDraftActionResult,
  type PortfolioType,
} from "@/lib/portfolio";

type UploadStatus = "selected" | "uploading" | "success" | "error";

type SelectedUpload = {
  id: string;
  file: File;
  previewUrl: string;
  title: string;
  altText: string;
  status: UploadStatus;
  message: string;
  itemId?: string;
};

function selectedUpload(file: File, index: number): SelectedUpload {
  const metadata = draftMetadataFromFilename(file.name);
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
    file,
    previewUrl: URL.createObjectURL(file),
    ...metadata,
    status: "selected",
    message: "Ready to upload as a private draft.",
  };
}

export function BulkUploadForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrls = useRef<string[]>([]);
  const [items, setItems] = useState<SelectedUpload[]>([]);
  const [type, setType] = useState<PortfolioType>("tattoo");
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState("");

  useEffect(
    () => () => {
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  function replaceSelection(files: FileList | null) {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    const nextItems = Array.from(files ?? []).map(selectedUpload);
    previewUrls.current = nextItems.map((item) => item.previewUrl);
    setItems(nextItems);
    setSummary(
      nextItems.length
        ? `${nextItems.length} image${nextItems.length === 1 ? "" : "s"} selected.`
        : "",
    );
  }

  function updateItem(
    id: string,
    updates: Partial<Pick<SelectedUpload, "title" | "altText">>,
  ) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    );
  }

  function removeItem(id: string) {
    setItems((current) => {
      const removed = current.find((item) => item.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
        previewUrls.current = previewUrls.current.filter(
          (url) => url !== removed.previewUrl,
        );
      }
      const next = current.filter((item) => item.id !== id);
      if (!next.length && inputRef.current) inputRef.current.value = "";
      return next;
    });
  }

  function applyResult(id: string, result: BulkDraftActionResult) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: result.status,
              message: result.message,
              itemId: result.itemId,
            }
          : item,
      ),
    );
  }

  async function uploadBatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const pendingItems = items.filter((item) => item.status !== "success");
    if (!pendingItems.length) {
      setSummary("Select at least one image to upload.");
      return;
    }

    setSubmitting(true);
    setSummary(`Uploading 0 of ${pendingItems.length}…`);
    let succeeded = 0;

    for (const item of pendingItems) {
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, status: "uploading", message: "Uploading…" }
            : currentItem,
        ),
      );

      const formData = new FormData();
      formData.set("title", item.title);
      formData.set("altText", item.altText);
      formData.set("type", type);
      formData.set("image", item.file);

      try {
        const result = await createBulkPortfolioDraft(formData);
        applyResult(item.id, result);
        if (result.status === "success") succeeded += 1;
      } catch {
        applyResult(item.id, {
          status: "error",
          message: "Upload could not be completed. Try this image again.",
        });
      }
      setSummary(`Uploaded ${succeeded} of ${pendingItems.length}.`);
    }

    setSubmitting(false);
    router.refresh();
  }

  return (
    <form className="bulk-upload-form" onSubmit={uploadBatch}>
      <div className="bulk-upload-controls">
        <label>
          Work type
          <select
            value={type}
            onChange={(event) => setType(event.target.value as PortfolioType)}
            disabled={submitting}
          >
            {portfolioTypes.map((portfolioType) => (
              <option value={portfolioType} key={portfolioType}>
                {portfolioType[0].toUpperCase() + portfolioType.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label className="bulk-file-picker">
          Select images
          <span>JPEG, PNG, or WebP; maximum 10 MB per image.</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => replaceSelection(event.target.files)}
            disabled={submitting}
          />
        </label>
      </div>

      <p className="bulk-upload-summary" role="status" aria-live="polite">
        {summary || "Choose one or more images to prepare a private batch."}
      </p>

      {items.length ? (
        <div className="bulk-preview-list">
          {items.map((item) => (
            <article className="bulk-preview-card" key={item.id}>
              <div className="bulk-preview-image">
                <Image
                  src={item.previewUrl}
                  alt=""
                  fill
                  unoptimized
                  sizes="10rem"
                />
              </div>
              <div className="bulk-preview-fields">
                <p className="bulk-filename">{item.file.name}</p>
                <label>
                  Title
                  <input
                    value={item.title}
                    minLength={2}
                    maxLength={100}
                    onChange={(event) =>
                      updateItem(item.id, { title: event.target.value })
                    }
                    disabled={submitting || item.status === "success"}
                    required
                  />
                </label>
                <label>
                  Image description
                  <input
                    value={item.altText}
                    minLength={5}
                    maxLength={180}
                    onChange={(event) =>
                      updateItem(item.id, { altText: event.target.value })
                    }
                    disabled={submitting || item.status === "success"}
                    required
                  />
                </label>
                <p className={`bulk-file-state ${item.status}`}>
                  {item.message}
                </p>
              </div>
              <button
                className="text-button bulk-remove"
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={submitting || item.status === "success"}
                aria-label={`Remove ${item.file.name} from this batch`}
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      ) : null}

      <button
        className="button button-dark"
        type="submit"
        disabled={
          submitting || !items.some((item) => item.status !== "success")
        }
      >
        {submitting ? "Uploading batch…" : "Upload private drafts"}
      </button>
      <p className="bulk-upload-note">
        Drafts stay private. Add an approved description from the portfolio desk
        before publishing.
      </p>
    </form>
  );
}
