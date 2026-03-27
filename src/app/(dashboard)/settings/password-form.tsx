"use client";

import { useActionState } from "react";
import { changePassword } from "@/lib/actions/settings";

const inputClass =
  "w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition";
const labelClass =
  "block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5";

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, {});

  return (
    <form action={action} className="px-6 py-5 space-y-5">
      <div className="max-w-xs">
        <label htmlFor="current" className={labelClass}>
          Current Password
        </label>
        <input
          id="current"
          name="current"
          type="password"
          required
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className={labelClass}>
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Min. 8 characters"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="Repeat new password"
            className={inputClass}
          />
        </div>
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-emerald-400">
          Password updated successfully.
        </p>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {pending ? "Updating…" : "Update Password"}
        </button>
      </div>
    </form>
  );
}
