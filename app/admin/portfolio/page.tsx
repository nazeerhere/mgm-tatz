import Image from "next/image";
import Link from "next/link";
import {
  publishPortfolioItem,
  unpublishPortfolioItem,
} from "@/app/actions/portfolio";
import { AdminNotice, AdminShell } from "@/components/admin-shell";
import { getAdminPortfolioItems } from "@/lib/admin";
import { requireOwner } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    published?: string;
    unpublished?: string;
    updated?: string;
    error?: string;
  }>;
}) {
  const { supabase } = await requireOwner();
  const [params, result] = await Promise.all([
    searchParams,
    getAdminPortfolioItems(supabase),
  ]);
  const success = params.saved
    ? "Private image draft saved."
    : params.published
      ? "Portfolio item published."
      : params.unpublished
        ? "Portfolio item returned to a private draft."
        : params.updated
          ? "Portfolio metadata updated."
          : undefined;

  return (
    <AdminShell
      eyebrow="Content library"
      title="Portfolio"
      description="Canonical media records, publication state, and surface visibility."
      actions={
        <Link className="admin-primary-action" href="/admin/portfolio/new">
          Upload images
        </Link>
      }
    >
      <AdminNotice
        success={success}
        error={
          params.error ??
          (result.error
            ? "Portfolio data requires the latest checked-in migration."
            : undefined)
        }
      />
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p>Library</p>
            <h2>All portfolio items</h2>
          </div>
          <span>{result.items.length} total</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table admin-portfolio-table">
            <thead>
              <tr>
                <th>Work</th>
                <th>Type</th>
                <th>Publication</th>
                <th>Gallery</th>
                <th>Homepage</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="admin-work-cell">
                      <span className="admin-thumbnail">
                        {item.thumbnailUrl ? (
                          <Image
                            src={item.thumbnailUrl}
                            alt={item.thumbnailAlt}
                            fill
                            sizes="64px"
                            unoptimized
                          />
                        ) : null}
                      </span>
                      <strong>{item.title}</strong>
                    </div>
                  </td>
                  <td className="admin-capitalize">{item.type}</td>
                  <td>
                    <span
                      className={`admin-status ${item.published ? "live" : "draft"}`}
                    >
                      {item.published ? "Published" : "Private draft"}
                    </span>
                  </td>
                  <td>
                    {item.published && item.show_in_gallery
                      ? "Visible"
                      : "Hidden"}
                  </td>
                  <td>
                    {item.published && item.featured
                      ? `Slot ${item.homepage_order}`
                      : "Not shown"}
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <Link href={`/admin/portfolio/${item.id}`}>Edit</Link>
                      {item.published ? (
                        <form action={unpublishPortfolioItem}>
                          <input type="hidden" name="itemId" value={item.id} />
                          <button className="danger">Unpublish</button>
                        </form>
                      ) : (
                        <form action={publishPortfolioItem}>
                          <input type="hidden" name="itemId" value={item.id} />
                          <button>Publish</button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!result.items.length && !result.error ? (
          <p className="admin-empty">No portfolio items yet.</p>
        ) : null}
      </section>
    </AdminShell>
  );
}
