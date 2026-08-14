import type { Metadata } from "next";
import { login } from "@/app/actions/auth";
import { hasSupabaseEnvironment } from "@/lib/env";

export const metadata: Metadata = { title: "Owner login" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = hasSupabaseEnvironment();
  return (
    <section className="admin-shell login-shell">
      <p className="kicker">Private studio</p>
      <h1>Owner login</h1>
      <p>Use the invited owner account to manage portfolio work.</p>
      {error ? (
        <p className="form-error" role="alert">
          Email or password was not accepted.
        </p>
      ) : null}
      {!configured ? (
        <p className="form-error" role="alert">
          Development Supabase environment is not configured.
        </p>
      ) : null}
      <form action={login} className="admin-form">
        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="username"
            required
            disabled={!configured}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={!configured}
          />
        </label>
        <button className="button button-dark" disabled={!configured}>
          Sign in
        </button>
      </form>
    </section>
  );
}
