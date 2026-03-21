"use client";

import { useActionState, useState } from "react";
import { updateProfile } from "@/lib/actions/users";
import { Camera } from "lucide-react";

const inputClass =
  "w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition";
const labelClass =
  "block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5";

interface Props {
  name: string;
  email: string;
  initials: string;
}

export function ProfileForm({ name, email, initials }: Props) {
  const [state, action, pending] = useActionState(updateProfile, {});
  const [phone, setPhone] = useState("");

  return (
    <form action={action} className="px-6 py-5 space-y-5">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl select-none">
            {initials}
          </div>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
          >
            <Camera className="h-3 w-3" />
          </button>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>Full Name</label>
          <input
            id="name" name="name" type="text" required
            defaultValue={name}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input
            id="email" name="email" type="email" required
            defaultValue={email}
            className={inputClass}
          />
        </div>
      </div>

      {/* Phone */}
      <div className="max-w-xs">
        <label htmlFor="phone" className={labelClass}>Phone Number</label>
        <input
          id="phone" name="phone" type="tel"
          placeholder="01XXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
        />
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-400">Profile updated.</p>}

      <div className="pt-1">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
