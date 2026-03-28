"use client";

import { useActionState, useState } from "react";
import { Eye, EyeOff, ShieldAlert, UserCheck, UserX } from "lucide-react";
import { deactivateUser, reactivateUser } from "@/lib/actions/settings";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
};

interface Props {
  users: User[];
  currentUserId: string;
}

const initialState = { error: undefined, success: false };

const roleStyles: Record<string, string> = {
  ADMIN: "bg-primary/10 text-primary",
  DENTIST: "bg-indigo-500/10 text-indigo-400",
  RECEPTIONIST: "bg-secondary text-muted-foreground",
};

const statusStyles: Record<"active" | "inactive", string> = {
  active: "bg-emerald-500/10 text-emerald-400",
  inactive: "bg-red-500/10 text-red-400",
};

const inputClass =
  "w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none transition focus:ring-2 focus:ring-ring";

const labelClass =
  "mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground";

function UserRow({
  user,
  currentUserId,
}: {
  user: User;
  currentUserId: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [deactivateState, deactivateAction, deactivatePending] = useActionState(
    deactivateUser,
    initialState,
  );

  const [reactivateState, reactivateAction, reactivatePending] = useActionState(
    reactivateUser,
    initialState,
  );

  const isSelf = user.id === currentUserId;
  const isInactive = !user.isActive;

  const state = isInactive ? reactivateState : deactivateState;
  const pending = isInactive ? reactivatePending : deactivatePending;
  const action = isInactive ? reactivateAction : deactivateAction;

  return (
    <div className="divide-y divide-border">
      <div className="flex items-center gap-4 px-6 py-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {user.name}
            {isSelf && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                (you)
              </span>
            )}
          </p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
              roleStyles[user.role] ?? "bg-secondary text-muted-foreground"
            }`}
          >
            {user.role.toLowerCase()}
          </span>

          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isInactive ? statusStyles.inactive : statusStyles.active
            }`}
          >
            {isInactive ? "inactive" : "active"}
          </span>
        </div>

        {!isSelf && (
          <button
            type="button"
            onClick={() => setExpanded((o) => !o)}
            className={`rounded-md p-1.5 transition-colors ${
              expanded
                ? isInactive
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
            aria-label={isInactive ? "Reactivate user" : "Deactivate user"}
          >
            {isInactive ? (
              <UserCheck className="h-4 w-4" />
            ) : (
              <UserX className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {expanded && !isSelf && (
        <div
          className={`px-6 py-4 ${
            isInactive
              ? "border-t border-emerald-500/10 bg-emerald-500/5"
              : "border-t border-red-500/10 bg-red-500/5"
          }`}
        >
          {state.success ? (
            <p
              className={`text-sm font-medium ${
                isInactive ? "text-emerald-400" : "text-amber-400"
              }`}
            >
              {isInactive
                ? "User reactivated successfully."
                : "User deactivated successfully."}
            </p>
          ) : (
            <form action={action} className="space-y-4">
              <input type="hidden" name="targetId" value={user.id} />

              <div className="flex items-start gap-3">
                <ShieldAlert
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    isInactive ? "text-emerald-400" : "text-red-400"
                  }`}
                />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {isInactive ? (
                    <>
                      You are about to{" "}
                      <span className="font-semibold text-foreground">
                        reactivate
                      </span>{" "}
                      <span className="font-semibold text-foreground">
                        {user.name}
                      </span>
                      . They will be able to access the system again.
                    </>
                  ) : (
                    <>
                      You are about to{" "}
                      <span className="font-semibold text-foreground">
                        deactivate
                      </span>{" "}
                      <span className="font-semibold text-foreground">
                        {user.name}
                      </span>
                      . Their account will remain in the system, but they will
                      no longer be able to log in. This action should only be
                      taken after NOTICE PERIOD, so the doctor have finished all
                      scheduled appointments.
                    </>
                  )}{" "}
                  Confirm your password to proceed.
                </p>
              </div>

              <div>
                <label htmlFor={`password-${user.id}`} className={labelClass}>
                  Your password
                </label>
                <div className="relative">
                  <input
                    id={`password-${user.id}`}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your admin password"
                    className={inputClass + " pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((o) => !o)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {state.error && (
                <p className="text-xs font-medium text-red-400">
                  {state.error}
                </p>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={pending}
                  className={`rounded-md px-4 py-2 text-xs font-semibold text-white transition-colors disabled:opacity-50 ${
                    isInactive
                      ? "bg-emerald-500 hover:bg-emerald-600"
                      : "bg-amber-500 hover:bg-amber-600"
                  }`}
                >
                  {pending
                    ? isInactive
                      ? "Reactivating…"
                      : "Deactivating…"
                    : isInactive
                      ? "Reactivate User"
                      : "Deactivate User"}
                </button>

                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="rounded-md px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export function ManageUsers({ users, currentUserId }: Props) {
  return (
    <div className="divide-y divide-border">
      {users.map((user) => (
        <UserRow key={user.id} user={user} currentUserId={currentUserId} />
      ))}
    </div>
  );
}
