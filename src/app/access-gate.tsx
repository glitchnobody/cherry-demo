"use client";

import { FormEvent, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type AccessRole = "guest" | "admin";
type GateState = "checking" | "locked" | "unlocked";

const STORAGE_KEYS: Record<AccessRole, string> = {
  guest: "ad-agent-guest-password",
  admin: "ad-agent-admin-password",
};

async function validate(password: string, role: AccessRole) {
  try {
    const response = await fetch("/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, role }),
    });

    if (!response.ok) return false;

    const result = (await response.json()) as { valid?: boolean };
    return result.valid === true;
  } catch {
    return false;
  }
}

export function AccessGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role: AccessRole =
    pathname === "/admin" || pathname.startsWith("/admin/") ? "admin" : "guest";

  return (
    <RoleAccessGate key={role} role={role}>
      {children}
    </RoleAccessGate>
  );
}

function RoleAccessGate({
  children,
  role,
}: {
  children: React.ReactNode;
  role: AccessRole;
}) {
  const [state, setState] = useState<GateState>("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    const savedPassword = window.localStorage.getItem(STORAGE_KEYS[role]);

    const validation = validate(savedPassword ?? "", role);

    validation.then((valid) => {
      if (!active) return;

      if (valid) {
        setState("unlocked");
      } else {
        if (savedPassword) {
          window.localStorage.removeItem(STORAGE_KEYS[role]);
        }
        setState("locked");
      }
    });

    return () => {
      active = false;
    };
  }, [role]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || submitting) return;

    setSubmitting(true);
    setError("");

    const valid = await validate(password, role);

    if (valid) {
      window.localStorage.setItem(STORAGE_KEYS[role], password);
      setState("unlocked");
    } else {
      setError("That password isn't correct.");
      setSubmitting(false);
    }
  }

  if (state === "checking") {
    return <div className="access-loading" aria-label="Checking access" />;
  }

  if (state === "unlocked") return children;

  return (
    <main className="access-page">
      <section className="access-card" aria-labelledby="access-title">
        <div className="access-copy">
          <p className="access-eyebrow">{role === "admin" ? "Admin" : "Guest"} access</p>
          <h1 id="access-title">Enter password</h1>
          <p>Use the password provided to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="access-form">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            autoFocus
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "password-error" : undefined}
            placeholder="Enter password"
          />
          <div className="access-form-footer">
            <p id="password-error" className="access-error" aria-live="polite">
              {error}
            </p>
            <button type="submit" disabled={!password || submitting}>
              {submitting ? "Checking..." : "Continue"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
