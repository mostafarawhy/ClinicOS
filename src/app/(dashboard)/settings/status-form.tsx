"use client";

import { useActionState, useEffect, useState } from "react";
import { AvailabilityStatus } from "@prisma/client";
import { cn } from "@/lib/utils";
import {
  type SettingsActionState,
  updateAvailabilityStatus,
} from "@/lib/actions/settings";

const STATUSES: {
  value: AvailabilityStatus;
  label: string;
  dot: string;
}[] = [
  {
    value: AvailabilityStatus.AVAILABLE,
    label: "Available",
    dot: "bg-emerald-400",
  },
  {
    value: AvailabilityStatus.BUSY,
    label: "Busy",
    dot: "bg-yellow-400",
  },
  {
    value: AvailabilityStatus.SICK_LEAVE,
    label: "Sick Leave",
    dot: "bg-red-400",
  },
  {
    value: AvailabilityStatus.VACATION,
    label: "Vacation",
    dot: "bg-blue-400",
  },
  {
    value: AvailabilityStatus.REMOTE,
    label: "Remote",
    dot: "bg-indigo-400",
  },
  {
    value: AvailabilityStatus.DAY_OFF,
    label: "Day Off",
    dot: "bg-muted-foreground",
  },
];

const initialState: SettingsActionState = {};

interface StatusFormProps {
  initialStatus?: AvailabilityStatus;
}

export function StatusForm({
  initialStatus = AvailabilityStatus.AVAILABLE,
}: StatusFormProps) {
  const [selected, setSelected] = useState<AvailabilityStatus>(initialStatus);

  const [state, formAction, isPending] = useActionState(
    updateAvailabilityStatus,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      // keep UI synced after successful save
      setSelected(selected);
    }
  }, [state.success, selected]);

  return (
    <form action={formAction} className="space-y-4 px-6 py-5">
      <input type="hidden" name="availabilityStatus" value={selected} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {STATUSES.map((status) => {
          const active = selected === status.value;

          return (
            <button
              key={status.value}
              type="button"
              onClick={() => setSelected(status.value)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              <span
                className={cn("h-2.5 w-2.5 shrink-0 rounded-full", status.dot)}
              />
              {status.label}
            </button>
          );
        })}
      </div>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}

      {state.success && (
        <p className="text-sm text-emerald-400">
          Availability status updated successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Saving..." : "Set Status"}
      </button>
    </form>
  );
}
