"use client";

import { useActionState } from "react";
import { createUser } from "@/lib/actions/users";
import { CheckCircle2 } from "lucide-react";

const initialState = { error: undefined, success: false };

const inputClass =
  "w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition";
const labelClass =
  "block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5";

export function AddUserForm() {
  const [state, action, pending] = useActionState(createUser, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center justify-center py-14 gap-4">
        <CheckCircle2 className="h-10 w-10 text-primary" />
        <div className="text-center">
          <p className="font-semibold text-foreground">User Created</p>
          <p className="text-sm text-muted-foreground mt-1">
            The new account is ready to use.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="px-6 py-5 space-y-5">
      {/* Row 1 – name + email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>Full Name</label>
          <input
            id="name" name="name" type="text" required
            placeholder="Dr. Ahmed Hassan"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            id="email" name="email" type="email" required
            placeholder="ahmed@clinic.com"
            className={inputClass}
          />
        </div>
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className={labelClass}>Role</label>
        <select id="role" name="role" required className={inputClass}>
          <option value="">Select role</option>
          <option value="DENTIST">Dentist</option>
          <option value="RECEPTIONIST">Receptionist</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Row 2 – passwords */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <input
            id="password" name="password" type="password" required
            placeholder="Min. 8 characters"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
          <input
            id="confirmPassword" name="confirmPassword" type="password" required
            placeholder="Repeat password"
            className={inputClass}
          />
        </div>
      </div>

      {state.error && (
        <p className="text-sm text-red-400">{state.error}</p>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {pending ? "Creating…" : "Create User"}
        </button>
      </div>
    </form>
  );
}
