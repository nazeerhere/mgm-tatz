import Link from "next/link";
import { BulkUploadForm } from "@/components/bulk-upload-form";
import { AdminShell } from "@/components/admin-shell";
import { requireOwner } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewPortfolioItemPage() {
  await requireOwner();
  return (
    <AdminShell
      eyebrow="Portfolio"
      title="Upload images"
      description="Create independent private drafts for review before publication."
      actions={
        <Link className="admin-secondary-action" href="/admin/portfolio">
          Back to portfolio
        </Link>
      }
    >
      <p className="admin-intro">
        Select several images at once, review their working titles and image
        descriptions, then upload each as an independent private draft.
      </p>
      <BulkUploadForm />
    </AdminShell>
  );
}
