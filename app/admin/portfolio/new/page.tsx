import Link from "next/link";
import { createPortfolioItem } from "@/app/actions/portfolio";
import { requireOwner } from "@/lib/auth";
import { portfolioTypes } from "@/lib/portfolio";

export const dynamic = "force-dynamic";

export default async function NewPortfolioItemPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireOwner();
  const { error } = await searchParams;
  return (
    <section className="admin-shell">
      <Link className="back-link" href="/admin">
        ← Portfolio desk
      </Link>
      <p className="kicker">New work</p>
      <h1>Create a private draft.</h1>
      {error ? (
        <p className="form-error" role="alert">
          {error}
        </p>
      ) : null}
      <form
        action={createPortfolioItem}
        className="admin-form upload-form"
        encType="multipart/form-data"
      >
        <label>
          Title
          <input name="title" minLength={2} maxLength={100} required />
        </label>
        <label>
          Type
          <select name="type" required>
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
            minLength={10}
            maxLength={800}
            rows={6}
            required
          />
        </label>
        <label>
          Body placement <span>Optional; primarily for tattoos.</span>
          <input name="bodyPlacement" maxLength={100} />
        </label>
        <label>
          Primary image <span>JPEG, PNG, or WebP; maximum 10 MB.</span>
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
          />
        </label>
        <label>
          Image description{" "}
          <span>Describe visible content for screen-reader users.</span>
          <input name="altText" minLength={5} maxLength={180} required />
        </label>
        <div className="check-row">
          <label>
            <input name="featured" type="checkbox" /> Featured work
          </label>
          <label>
            <input name="available" type="checkbox" /> Available concept
          </label>
        </div>
        <button className="button button-dark">Save private draft</button>
      </form>
    </section>
  );
}
