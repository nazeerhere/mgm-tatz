import type { ReactNode } from "react";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { AdminNav } from "@/components/admin-nav";

export function AdminShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="admin-app">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">
          <span>MGM</span>
          <strong>MGM.TATZ</strong>
          <small>Studio administration</small>
        </Link>
        <AdminNav />
        <form action={logout} className="admin-signout">
          <button>Sign out</button>
        </form>
      </aside>
      <div className="admin-main">
        <header className="admin-page-header">
          <div>
            <p>{eyebrow}</p>
            <h1>{title}</h1>
            {description ? <span>{description}</span> : null}
          </div>
          {actions ? <div className="admin-page-actions">{actions}</div> : null}
        </header>
        {children}
      </div>
    </section>
  );
}

export function AdminNotice({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  return (
    <>
      {success ? (
        <p className="admin-notice success" role="status">
          {success}
        </p>
      ) : null}
      {error ? (
        <p className="admin-notice error" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
