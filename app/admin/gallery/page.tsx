import Image from "next/image";
import Link from "next/link";
import { updateGalleryVisibility } from "@/app/actions/portfolio";
import { AdminNotice, AdminShell } from "@/components/admin-shell";
import { getAdminPortfolioItems } from "@/lib/admin";
import { requireOwner } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ updated?: string; error?: string }>;
}) {
  const { supabase } = await requireOwner();
  const [params, result] = await Promise.all([
    searchParams,
    getAdminPortfolioItems(supabase),
  ]);
  const published = result.items.filter((item) => item.published);
  const visibleCount = published.filter((item) => item.show_in_gallery).length;

  return (
    <AdminShell
      eyebrow="Placement"
      title="Gallery"
      description="Control Gallery inclusion independently from publication and homepage placement."
    >
      <AdminNotice
        success={params.updated ? "Gallery visibility updated." : undefined}
        error={
          params.error ??
          (result.error
            ? "Gallery placement requires the latest checked-in migration."
            : undefined)
        }
      />
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p>Published library</p>
            <h2>Gallery visibility</h2>
          </div>
          <span>{visibleCount} visible</span>
        </div>
        <div className="admin-compact-list admin-gallery-list">
          {published.map((item) => (
            <article key={item.id}>
              <span className="admin-thumbnail">
                {item.thumbnailUrl ? (
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.thumbnailAlt}
                    fill
                    sizes="56px"
                    unoptimized
                  />
                ) : null}
              </span>
              <div>
                <strong>{item.title}</strong>
                <small className="admin-capitalize">{item.type}</small>
              </div>
              <span
                className={`admin-status ${item.show_in_gallery ? "live" : "draft"}`}
              >
                {item.show_in_gallery ? "Visible" : "Hidden"}
              </span>
              <div className="admin-row-actions">
                <Link href={`/admin/portfolio/${item.id}`}>Edit metadata</Link>
                <form action={updateGalleryVisibility}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <input
                    type="hidden"
                    name="visible"
                    value={item.show_in_gallery ? "false" : "true"}
                  />
                  <button>
                    {item.show_in_gallery ? "Remove" : "Add to Gallery"}
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
        {!published.length && !result.error ? (
          <p className="admin-empty">
            Publish portfolio work before managing the Gallery.
          </p>
        ) : null}
      </section>
    </AdminShell>
  );
}
