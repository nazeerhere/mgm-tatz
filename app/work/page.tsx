import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DevelopmentGallery } from "@/components/development-gallery";
import { Gallery } from "@/components/gallery";
import {
  developmentDrawings,
  developmentTattoos,
} from "@/content/development-media";
import {
  filterAndSortGalleryItems,
  galleryHref,
  paginateGalleryItems,
  parseGalleryFilters,
} from "@/lib/gallery-filters";
import { getPublishedPortfolioPage } from "@/lib/queries";

export const metadata: Metadata = { title: "Work" };
export const dynamic = "force-dynamic";

export default async function WorkPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string | string[];
    style?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
}) {
  const { filters, page } = parseGalleryFilters(await searchParams);
  const result = await getPublishedPortfolioPage(filters, page);
  const developmentItems = [...developmentTattoos, ...developmentDrawings].map(
    (item, displayOrder) => ({
      ...item,
      featured: "featured" in item ? item.featured : false,
      displayOrder,
    }),
  );
  const fallbackItems = filterAndSortGalleryItems(developmentItems, filters);
  const fallbackPage = paginateGalleryItems(fallbackItems, page);
  const currentPage = result.configured
    ? result.currentPage
    : fallbackPage.currentPage;
  if (page !== currentPage) redirect(galleryHref(filters, currentPage));
  return (
    <section className="section dark work-index">
      <header className="work-index-header">
        <p className="kicker">MGM.TATZ portfolio</p>
        <h1>Tattoo work.</h1>
        <p className="lede">
          A focused selection of finished tattoo work and illustrative studies.
        </p>
      </header>
      {result.configured ? (
        <Gallery
          items={result.items}
          filters={filters}
          totalCount={result.count}
          currentPage={result.currentPage}
          totalPages={result.totalPages}
          headingLevel="h2"
        />
      ) : (
        <DevelopmentGallery
          items={fallbackPage.items}
          filters={filters}
          totalCount={fallbackItems.length}
          currentPage={fallbackPage.currentPage}
          totalPages={fallbackPage.totalPages}
          headingLevel="h2"
        />
      )}
    </section>
  );
}
