import Link from "next/link";
import { AdminNotice, AdminShell } from "@/components/admin-shell";
import { getAdminPortfolioItems } from "@/lib/admin";
import { requireOwner } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { supabase } = await requireOwner();
  const params = await searchParams;
  const [{ items, error: portfolioError }, faqResult] = await Promise.all([
    getAdminPortfolioItems(supabase),
    supabase.from("faqs").select("id", { count: "exact", head: true }),
  ]);
  const metrics = [
    ["Portfolio items", items.length],
    ["Published", items.filter((item) => item.published).length],
    [
      "Gallery visible",
      items.filter((item) => item.published && item.show_in_gallery).length,
    ],
    [
      "Homepage assigned",
      items.filter((item) => item.published && item.featured).length,
    ],
    ["FAQ entries", faqResult.error ? "—" : (faqResult.count ?? 0)],
  ] as const;

  return (
    <AdminShell
      eyebrow="Overview"
      title="Dashboard"
      description="Manage the public portfolio and studio information."
      actions={
        <Link className="admin-primary-action" href="/admin/portfolio/new">
          Upload images
        </Link>
      }
    >
      <AdminNotice
        error={
          params.error ??
          (portfolioError
            ? "Portfolio data requires the latest checked-in migration."
            : faqResult.error
              ? "FAQ management requires the checked-in FAQ migration."
              : undefined)
        }
      />
      <div className="admin-metrics">
        {metrics.map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p>Shortcuts</p>
            <h2>Quick actions</h2>
          </div>
        </div>
        <div className="admin-quick-actions">
          <Link href="/admin/portfolio/new">Upload images</Link>
          <Link href="/admin/homepage">Manage homepage</Link>
          <Link href="/admin/gallery">Manage gallery</Link>
          <Link href="/admin/faq">Manage FAQ</Link>
        </div>
      </section>
    </AdminShell>
  );
}
