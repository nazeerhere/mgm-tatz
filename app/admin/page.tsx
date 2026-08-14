import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { publishPortfolioItem } from "@/app/actions/portfolio";
import { requireOwner } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; published?: string; error?: string }>;
}) {
  const { supabase } = await requireOwner();
  const params = await searchParams;
  const { data: items } = await supabase
    .from("portfolio_items")
    .select("id,title,type,published,created_at,portfolio_media(id,alt_text)")
    .order("created_at", { ascending: false });
  return (
    <section className="admin-shell">
      <div className="admin-header">
        <div>
          <p className="kicker">Private studio</p>
          <h1>Portfolio desk</h1>
        </div>
        <form action={logout}>
          <button className="text-button">Sign out</button>
        </form>
      </div>
      {params.saved ? (
        <p className="form-success" role="status">
          Draft and private image saved.
        </p>
      ) : null}
      {params.published ? (
        <p className="form-success" role="status">
          Item published to the public gallery.
        </p>
      ) : null}
      {params.error ? (
        <p className="form-error" role="alert">
          {params.error}
        </p>
      ) : null}
      <Link className="button button-dark" href="/admin/portfolio/new">
        Add portfolio item
      </Link>
      <div className="admin-list">
        <div className="admin-list-heading">
          <h2>Portfolio items</h2>
          <span>{items?.length ?? 0} total</span>
        </div>
        {items?.length ? (
          items.map((item) => (
            <article key={item.id} className="admin-row">
              <div>
                <span
                  className={`state ${item.published ? "published" : "draft"}`}
                >
                  {item.published ? "Published" : "Private draft"}
                </span>
                <h3>{item.title}</h3>
                <p>{item.type}</p>
              </div>
              {!item.published ? (
                <form action={publishPortfolioItem}>
                  <input type="hidden" name="itemId" value={item.id} />
                  <button className="button button-dark">Publish</button>
                </form>
              ) : (
                <Link href="/work">View public →</Link>
              )}
            </article>
          ))
        ) : (
          <p className="empty-state light">No portfolio items yet.</p>
        )}
      </div>
    </section>
  );
}
