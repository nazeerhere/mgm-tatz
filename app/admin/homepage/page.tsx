import Image from "next/image";
import {
  updateHomepageDrawingPlacement,
  updateHomepagePlacement,
} from "@/app/actions/portfolio";
import { AdminNotice, AdminShell } from "@/components/admin-shell";
import { getAdminHomepageDrawings, getAdminPortfolioItems } from "@/lib/admin";
import { requireOwner } from "@/lib/auth";
import { homepageSlots } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

type HomepageSlotItem = {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  thumbnailAlt: string;
};

function SlotEditor({
  slot,
  item,
  eligibleItems,
  action,
  orderField,
  surfaceLabel,
}: {
  slot: number;
  item?: HomepageSlotItem;
  eligibleItems: HomepageSlotItem[];
  action: (formData: FormData) => Promise<void>;
  orderField: "homepageOrder" | "drawingOrder";
  surfaceLabel: "Hero" | "Drawings";
}) {
  return (
    <article className="admin-slot-card">
      <span className="admin-slot-number">Slot {slot}</span>
      <div className="admin-slot-image">
        {item?.thumbnailUrl ? (
          <Image
            src={item.thumbnailUrl}
            alt={item.thumbnailAlt}
            fill
            sizes="(max-width: 700px) 100vw, 18vw"
            unoptimized
          />
        ) : (
          <span>Unassigned</span>
        )}
      </div>
      <strong>{item?.title ?? "No image assigned"}</strong>
      <div className="admin-slot-actions">
        <details className="admin-slot-picker">
          <summary>Change</summary>
          <div className="admin-slot-picker-list">
            {eligibleItems.map((candidate) => (
              <form action={action} key={candidate.id}>
                <input type="hidden" name="itemId" value={candidate.id} />
                <input type="hidden" name={orderField} value={slot} />
                <button
                  type="submit"
                  aria-label={`Assign ${candidate.title} to ${surfaceLabel} slot ${slot}`}
                  disabled={candidate.id === item?.id}
                >
                  <span className="admin-thumbnail">
                    {candidate.thumbnailUrl ? (
                      <Image
                        src={candidate.thumbnailUrl}
                        alt=""
                        fill
                        sizes="56px"
                        unoptimized
                      />
                    ) : null}
                  </span>
                  <span>
                    <strong>{candidate.title}</strong>
                    {candidate.id === item?.id ? <small>Assigned</small> : null}
                  </span>
                </button>
              </form>
            ))}
            {!eligibleItems.length ? (
              <p>Publish portfolio work to make it available here.</p>
            ) : null}
          </div>
        </details>
        {item ? (
          <form action={action}>
            <input type="hidden" name="itemId" value={item.id} />
            <input type="hidden" name={orderField} value="" />
            <button className="admin-slot-clear" type="submit">
              Clear
            </button>
          </form>
        ) : null}
      </div>
    </article>
  );
}

export default async function AdminHomepagePage({
  searchParams,
}: {
  searchParams: Promise<{
    updated?: string;
    error?: string;
    drawingsUpdated?: string;
    drawingsError?: string;
  }>;
}) {
  const { supabase } = await requireOwner();
  const [params, result, drawingsResult] = await Promise.all([
    searchParams,
    getAdminPortfolioItems(supabase),
    getAdminHomepageDrawings(supabase),
  ]);
  const published = result.items.filter((item) => item.published);
  const drawingItems = published.map((item) => {
    const drawingState = drawingsResult.placements.find(
      (candidate) => candidate.id === item.id,
    );
    return {
      ...item,
      drawing_featured: drawingState?.drawing_featured ?? false,
      homepage_drawing_order: drawingState?.homepage_drawing_order ?? null,
    };
  });

  return (
    <AdminShell
      eyebrow="Placement"
      title="Homepage"
      description="Assign published portfolio work to four hero slots and four independent drawing slots."
    >
      <AdminNotice
        success={
          params.drawingsUpdated
            ? "Homepage drawing placement updated."
            : params.updated
              ? "Homepage hero placement updated."
              : undefined
        }
        error={
          params.drawingsError ??
          params.error ??
          (result.error || drawingsResult.error
            ? "Homepage management requires the latest checked-in migrations."
            : undefined)
        }
      />

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p>Hero</p>
            <h2>Current hero slots</h2>
          </div>
          <span>
            {published.filter((item) => item.featured).length}/4 assigned
          </span>
        </div>
        <div className="admin-slot-grid">
          {homepageSlots.map((slot) => {
            const item = published.find(
              (candidate) =>
                candidate.featured && candidate.homepage_order === slot,
            );
            return (
              <SlotEditor
                key={slot}
                slot={slot}
                item={item}
                eligibleItems={published}
                action={updateHomepagePlacement}
                orderField="homepageOrder"
                surfaceLabel="Hero"
              />
            );
          })}
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p>Drawings</p>
            <h2>Current drawing slots</h2>
          </div>
          <span>
            {drawingItems.filter((item) => item.drawing_featured).length}/4
            assigned
          </span>
        </div>
        <div className="admin-slot-grid">
          {homepageSlots.map((slot) => {
            const item = drawingItems.find(
              (candidate) =>
                candidate.drawing_featured &&
                candidate.homepage_drawing_order === slot,
            );
            return (
              <SlotEditor
                key={slot}
                slot={slot}
                item={item}
                eligibleItems={drawingItems}
                action={updateHomepageDrawingPlacement}
                orderField="drawingOrder"
                surfaceLabel="Drawings"
              />
            );
          })}
        </div>
      </section>
    </AdminShell>
  );
}
