import { createFaq, deleteFaq, updateFaq } from "@/app/actions/faq";
import { AdminNotice, AdminShell } from "@/components/admin-shell";
import { requireOwner } from "@/lib/auth";
import type { FaqItem } from "@/lib/faq";

export const dynamic = "force-dynamic";

export default async function AdminFaqPage({
  searchParams,
}: {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
}) {
  const { supabase } = await requireOwner();
  const [params, result] = await Promise.all([
    searchParams,
    supabase
      .from("faqs")
      .select(
        "id,question,answer,display_order,is_active,created_at,updated_at",
      )
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ]);
  const items = (result.data ?? []) as FaqItem[];
  const success = params.created
    ? "FAQ created."
    : params.updated
      ? "FAQ updated."
      : params.deleted
        ? "FAQ deleted."
        : undefined;

  return (
    <AdminShell
      eyebrow="Site content"
      title="FAQ"
      description="Manage ordered questions shown on the public FAQ page."
    >
      <AdminNotice
        success={success}
        error={
          params.error ??
          (result.error
            ? "FAQ management requires the checked-in FAQ migration."
            : undefined)
        }
      />
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p>New entry</p>
            <h2>Create FAQ</h2>
          </div>
        </div>
        <form action={createFaq} className="admin-editor-form admin-faq-create">
          <label>
            Question
            <input name="question" minLength={5} maxLength={200} required />
          </label>
          <label>
            Answer
            <textarea
              name="answer"
              minLength={5}
              maxLength={2000}
              rows={4}
              required
            />
          </label>
          <label>
            Display order
            <input
              name="displayOrder"
              type="number"
              min={0}
              max={10000}
              defaultValue={items.length}
              required
            />
          </label>
          <label className="admin-checkbox">
            <input name="isActive" type="checkbox" defaultChecked />
            Show on public FAQ
          </label>
          <button className="admin-primary-action">Create FAQ</button>
        </form>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <p>Managed content</p>
            <h2>FAQ entries</h2>
          </div>
          <span>{items.length} total</span>
        </div>
        <div className="admin-faq-list">
          {items.map((item) => (
            <details key={item.id}>
              <summary>
                <span>
                  <strong>{item.question}</strong>
                  <small>
                    Order {item.display_order} ·{" "}
                    {item.is_active ? "Active" : "Hidden"}
                  </small>
                </span>
                <span>Edit</span>
              </summary>
              <div className="admin-faq-editor">
                <form action={updateFaq} className="admin-editor-form">
                  <input type="hidden" name="faqId" value={item.id} />
                  <label>
                    Question
                    <input
                      name="question"
                      defaultValue={item.question}
                      minLength={5}
                      maxLength={200}
                      required
                    />
                  </label>
                  <label>
                    Answer
                    <textarea
                      name="answer"
                      defaultValue={item.answer}
                      minLength={5}
                      maxLength={2000}
                      rows={5}
                      required
                    />
                  </label>
                  <label>
                    Display order
                    <input
                      name="displayOrder"
                      type="number"
                      min={0}
                      max={10000}
                      defaultValue={item.display_order}
                      required
                    />
                  </label>
                  <label className="admin-checkbox">
                    <input
                      name="isActive"
                      type="checkbox"
                      defaultChecked={item.is_active}
                    />
                    Show on public FAQ
                  </label>
                  <button className="admin-primary-action">Save changes</button>
                </form>
                <form action={deleteFaq} className="admin-delete-form">
                  <input type="hidden" name="faqId" value={item.id} />
                  <label className="admin-checkbox">
                    <input name="confirmDelete" type="checkbox" required />
                    Confirm permanent deletion
                  </label>
                  <button className="admin-danger-action">Delete FAQ</button>
                </form>
              </div>
            </details>
          ))}
        </div>
        {!items.length && !result.error ? (
          <p className="admin-empty">No FAQ entries yet.</p>
        ) : null}
      </section>
    </AdminShell>
  );
}
