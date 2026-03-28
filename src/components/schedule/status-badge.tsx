"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { updateAppointmentStatus } from "@/lib/actions/schedule";
import type { AppointmentStatus } from "@prisma/client";

const STATUS_OPTIONS: AppointmentStatus[] = [
  "UPCOMING",
  "COMPLETED",
  "NO_SHOW",
  "CANCELLED",
];

const statusConfig: Record<
  AppointmentStatus,
  { style: string; label: string }
> = {
  COMPLETED: {
    style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    label: "Completed",
  },
  UPCOMING: {
    style: "bg-primary/10 text-primary border-primary/20",
    label: "Upcoming",
  },
  NO_SHOW: {
    style: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    label: "No Show",
  },
  CANCELLED: {
    style: "bg-red-500/10 text-red-400 border-red-500/20",
    label: "Cancelled",
  },
};

function getStatusMeta(status: AppointmentStatus) {
  return {
    key: status,
    ...statusConfig[status],
  };
}

type StatusBadgeProps = {
  appointmentId: string;
  initialStatus: AppointmentStatus;
};

export default function StatusBadge({
  appointmentId,
  initialStatus,
}: StatusBadgeProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [pendingSelection, setPendingSelection] =
    useState<AppointmentStatus | null>(null);
  const [actionError, setActionError] = useState("");
  const [isPending, startTransition] = useTransition();

  const current = getStatusMeta(initialStatus);

  function handleSelect(next: AppointmentStatus) {
    if (next === current.key) {
      setOpen(false);
      return;
    }

    setActionError("");
    setPendingSelection(next);
  }

  function handleCancel() {
    if (isPending) return;

    setPendingSelection(null);
    setOpen(false);
    setActionError("");
  }

  function handleConfirm() {
    if (!pendingSelection) return;

    setActionError("");

    startTransition(async () => {
      const result = await updateAppointmentStatus(
        appointmentId,
        pendingSelection,
      );

      if (result.error) {
        setActionError(result.error);
        return;
      }

      setPendingSelection(null);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          setOpen((prev) => !prev);
          setPendingSelection(null);
          setActionError("");
        }}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-50 ${current.style}`}
      >
        {current.label}
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={handleCancel} />

          <div className="absolute right-0 z-50 mt-1.5 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            {!pendingSelection ? (
              <div className="p-1">
                {STATUS_OPTIONS.map((opt) => {
                  const cfg = statusConfig[opt];
                  const isActive = opt === current.key;

                  return (
                    <button
                      key={opt}
                      type="button"
                      disabled={isPending}
                      onClick={() => handleSelect(opt)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors disabled:opacity-50 ${
                        isActive
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${cfg.style}`}
                      >
                        {cfg.label}
                      </span>

                      {isActive && (
                        <span className="ml-auto text-[10px] text-primary">
                          current
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3 p-3">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Change status to{" "}
                  <span className="font-semibold text-foreground">
                    {statusConfig[pendingSelection].label}
                  </span>
                  ?
                </p>

                {actionError && (
                  <p className="text-xs text-red-400">{actionError}</p>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleConfirm}
                    className="flex-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isPending ? "Saving..." : "Confirm"}
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleCancel}
                    className="flex-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
