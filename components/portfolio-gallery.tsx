"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  galleryHref,
  galleryPageNumbers,
  galleryStyleOptions,
  type GalleryFilters,
} from "@/lib/gallery-filters";
import type { PortfolioType } from "@/lib/portfolio";

export type PortfolioGalleryItem = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  category: string;
  description?: string;
  type: PortfolioType;
  styleSlugs: readonly string[];
  featured: boolean;
  createdAt?: string;
  displayOrder: number;
};

const typeOptions = [
  { value: "all", label: "All" },
  { value: "tattoo", label: "Tattoos" },
  { value: "drawing", label: "Drawings" },
] as const;

export function PortfolioGallery({
  items,
  filters,
  totalCount,
  currentPage,
  totalPages,
  headingLevel = "h2",
}: {
  items: readonly PortfolioGalleryItem[];
  filters: GalleryFilters;
  totalCount: number;
  currentPage: number;
  totalPages: number;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeItem = items.find((item) => item.id === activeId) ?? null;

  function updateFilter(name: "type" | "style" | "sort", value: string) {
    const next = new URLSearchParams(searchParams.toString());
    const defaultValue = name === "sort" ? "featured" : "all";
    if (value === defaultValue) next.delete(name);
    else next.set(name, value);
    next.delete("page");
    const query = next.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeItem && !dialog.open) {
      dialog.showModal();
      document.body.classList.add("lightbox-open");
    } else if (!activeItem && dialog.open) {
      dialog.close();
    }

    return () => document.body.classList.remove("lightbox-open");
  }, [activeItem]);

  function closeLightbox() {
    dialogRef.current?.close();
  }

  return (
    <>
      <div className="portfolio-controls" aria-label="Gallery controls">
        <div className="portfolio-filter-header">
          <button
            className="portfolio-filter-toggle"
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="gallery-filter-panel"
            onClick={() => setFiltersOpen((current) => !current)}
          >
            Filters
            <span aria-hidden="true">{filtersOpen ? "▴" : "▾"}</span>
          </button>
          <p className="portfolio-result-count" aria-live="polite">
            {totalCount} {totalCount === 1 ? "work" : "works"}
          </p>
        </div>

        <div
          className="portfolio-filter-panel"
          id="gallery-filter-panel"
          hidden={!filtersOpen}
        >
          <fieldset>
            <legend>Type</legend>
            <div className="portfolio-control-options">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={filters.type === option.value}
                  onClick={() => updateFilter("type", option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="portfolio-style-filter">
            <legend>Style</legend>
            <div className="portfolio-control-options">
              {galleryStyleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={filters.style === option.value}
                  onClick={() => updateFilter("style", option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="portfolio-sort">
            <span>Sort</span>
            <select
              value={filters.sort}
              onChange={(event) => updateFilter("sort", event.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
            </select>
          </label>
        </div>
      </div>

      {items.length ? (
        <div className="portfolio-gallery" data-count={items.length}>
          {items.map((item) => (
            <article className="portfolio-tile" key={item.id}>
              <button
                className="portfolio-tile-open"
                type="button"
                aria-label={`View ${item.title}`}
                onClick={() => setActiveId(item.id)}
              >
                <span className="portfolio-tile-media">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    sizes="(max-width: 620px) calc(100vw - 2rem), (max-width: 960px) 50vw, 33vw"
                  />
                  <span className="portfolio-view-cue" aria-hidden="true">
                    View
                  </span>
                </span>
              </button>
              <div className="portfolio-tile-meta">
                <p>{item.category}</p>
                <Heading>{item.title}</Heading>
                {item.description ? <p>{item.description}</p> : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="portfolio-filter-empty" role="status">
          <p className="kicker">No matching work</p>
          <p>Try a broader type or style selection.</p>
        </div>
      )}

      {totalCount > 0 && totalPages > 1 ? (
        <nav className="portfolio-pagination" aria-label="Gallery pages">
          {currentPage > 1 ? (
            <Link href={galleryHref(filters, currentPage - 1)}>Previous</Link>
          ) : (
            <span aria-disabled="true">Previous</span>
          )}
          <div className="portfolio-page-numbers">
            {galleryPageNumbers(currentPage, totalPages).map((entry, index) =>
              entry === "ellipsis" ? (
                <span key={`ellipsis-${index}`} aria-hidden="true">
                  …
                </span>
              ) : entry === currentPage ? (
                <span key={entry} aria-current="page">
                  {entry}
                </span>
              ) : (
                <Link key={entry} href={galleryHref(filters, entry)}>
                  {entry}
                </Link>
              ),
            )}
          </div>
          {currentPage < totalPages ? (
            <Link href={galleryHref(filters, currentPage + 1)}>Next</Link>
          ) : (
            <span aria-disabled="true">Next</span>
          )}
        </nav>
      ) : null}

      <dialog
        className="portfolio-lightbox"
        ref={dialogRef}
        aria-label={
          activeItem ? `${activeItem.title} detail view` : "Work detail"
        }
        onClose={() => {
          document.body.classList.remove("lightbox-open");
          setActiveId(null);
        }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) closeLightbox();
        }}
      >
        {activeItem ? (
          <div className="portfolio-lightbox-panel">
            <div className="portfolio-lightbox-media">
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                fill
                sizes="(max-width: 720px) 92vw, 72vw"
              />
            </div>
            <div className="portfolio-lightbox-meta">
              <button
                className="portfolio-lightbox-close"
                type="button"
                onClick={closeLightbox}
              >
                <span aria-hidden="true">←</span> Back to gallery
              </button>
              <div>
                <p>{activeItem.category}</p>
                <h2>{activeItem.title}</h2>
                {activeItem.description ? (
                  <p>{activeItem.description}</p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
