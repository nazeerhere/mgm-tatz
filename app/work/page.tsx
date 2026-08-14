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
      <header className="work-index-header">
        <p className="kicker">MGM.TATZ portfolio</p>
        <h1>Tattoo work.</h1>
        <p className="lede">
          A focused selection of finished tattoo work and illustrative studies.
        </p>
      </header>
      {configured && items.length ? (
        <Gallery items={items} headingLevel="h2" />
      ) : (
        <DevelopmentGallery items={developmentTattoos} headingLevel="h2" />
      )}
    </section>
  );
}
