import type { Metadata } from "next";
import { DevelopmentGallery } from "@/components/development-gallery";
import { Gallery } from "@/components/gallery";
import { developmentTattoos } from "@/content/development-media";
import { getPublishedPortfolioItems } from "@/lib/queries";

export const metadata: Metadata = { title: "Work" };
export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const { items, configured } = await getPublishedPortfolioItems();
  return (
    <section className="section dark work-index">
      <p className="kicker">Portfolio</p>
      <h1>Selected work.</h1>
      <p className="lede">Finished tattoos, drawings, flash, and concepts.</p>
      {configured && items.length ? (
        <Gallery items={items} headingLevel="h2" />
      ) : (
        <DevelopmentGallery items={developmentTattoos} headingLevel="h2" />
      )}
    </section>
  );
}
