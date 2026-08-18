import Link from "next/link";
import { notFound } from "next/navigation";
import { updatePortfolioMetadata } from "@/app/actions/portfolio";
import { AdminShell } from "@/components/admin-shell";
import { requireOwner } from "@/lib/auth";
import { portfolioTypes } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function EditPortfolioItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const { supabase } = await requireOwner();
  const { data: item } = await supabase
    .from("portfolio_items")
    .select(
      "id,title,type,description,body_placement,published,portfolio_media!inner(alt_text,is_primary)",
    )
    .eq("id", id)
    .eq("portfolio_media.is_primary", true)
    .single();

  if (!item) notFound();
  const media = item.portfolio_media[0];
  if (!media) notFound();

  return (
    <AdminShell
      eyebrow="Portfolio"
      title="Edit metadata"
      description={item.title}
      actions={
        <Link className="admin-secondary-action" href="/admin/portfolio">
          Back to portfolio
        </Link>
      }
    >
      <p className={`admin-status ${item.published ? "live" : "draft"}`}>
        {item.published ? "Published" : "Private draft"}
      </p>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <form
        action={updatePortfolioMetadata}
        className="admin-editor-form admin-editor-panel"
      >
        <input name="itemId" type="hidden" value={item.id} />
        <label>
          Title
          <input
            name="title"
            defaultValue={item.title}
            minLength={2}
            maxLength={100}
            required
          />
        </label>
        <label>
          Type
          <select name="type" defaultValue={item.type} required>
            {portfolioTypes.map((type) => (
              <option value={type} key={type}>
                {type[0].toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Description
          <textarea
            name="description"
            defaultValue={item.description}
            minLength={10}
            maxLength={800}
            rows={6}
            required
          />
        </label>
        <label>
          Body placement <span>Optional; primarily for tattoos.</span>
          <input
            name="bodyPlacement"
            defaultValue={item.body_placement ?? ""}
            maxLength={100}
          />
        </label>
        <label>
          Image description
          <span>Describe visible content for screen-reader users.</span>
          <input
            name="altText"
            defaultValue={media.alt_text}
            minLength={5}
            maxLength={180}
            required
          />
        </label>
        <button className="admin-primary-action">Save metadata</button>
      </form>
    </AdminShell>
  );
}
