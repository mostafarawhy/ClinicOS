"use client";

import { useState } from "react";
import { Clock, Phone, ChevronDown } from "lucide-react";

type StatusKey = "upcoming" | "completed" | "no_show" | "cancelled";
type AvailabilityKey =
  | "available"
  | "busy"
  | "sick_leave"
  | "vacation"
  | "remote"
  | "day_off";

export type ScheduleAppointment = {
  id: string;
  patientName: string;
  phone: string;
  treatment: string;
  time: string;
  status: string;
};

const availabilityConfig: Record<
  AvailabilityKey,
  { color: string; label: string; message: string }
> = {
  available: {
    color: "bg-emerald-400",
    label: "Available",
    message: "Ready to see patients",
  },
  busy: {
    color: "bg-yellow-400",
    label: "Busy",
    message: "Currently with a patient",
  },
  sick_leave: {
    color: "bg-red-400",
    label: "Sick Leave",
    message: "Contact clinic admin",
  },
  vacation: {
    color: "bg-blue-400",
    label: "Vacation",
    message: "Out of office",
  },
  remote: {
    color: "bg-indigo-400",
    label: "Remote",
    message: "Working remotely today",
  },
  day_off: {
    color: "bg-muted-foreground",
    label: "Day Off",
    message: "Not available today",
  },
};

const statusConfig: Record<StatusKey, { style: string; label: string }> = {
  completed: {
    style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    label: "Completed",
  },
  upcoming: {
    style: "bg-primary/10 text-primary border-primary/20",
    label: "Upcoming",
  },
  no_show: {
    style: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    label: "No Show",
  },
  cancelled: {
    style: "bg-red-500/10 text-red-400 border-red-500/20",
    label: "Cancelled",
  },
};

const STATUS_OPTIONS: StatusKey[] = [
  "upcoming",
  "completed",
  "no_show",
  "cancelled",
];

function normalizeStatus(status: string): StatusKey | null {
  const value = status.toLowerCase();

  if (
    value === "upcoming" ||
    value === "completed" ||
    value === "no_show" ||
    value === "cancelled"
  ) {
    return value;
  }

  return null;
}

function getStatusMeta(status: string) {
  const normalized = normalizeStatus(status);

  if (!normalized) {
    return {
      key: null,
      style: "bg-secondary text-muted-foreground border-border",
      label: status || "Unknown",
    };
  }

  return {
    key: normalized,
    ...statusConfig[normalized],
  };
}

function StatusBadge({
  appointmentId,
  initialStatus,
}: {
  appointmentId: string;
  initialStatus: string;
}) {
  const [status, setStatus] = useState<string>(initialStatus);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<StatusKey | null>(null);

  const current = getStatusMeta(status);

  function handleSelect(next: StatusKey) {
    if (next === current.key) {
      setOpen(false);
      return;
    }
    setPending(next);
  }

  function handleConfirm() {
    if (!pending) return;

    setStatus(pending);
    setPending(null);
    setOpen(false);

    console.log(`Appointment ${appointmentId} status -> ${pending}`);
  }

  function handleCancel() {
    setPending(null);
    setOpen(false);
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          setPending(null);
        }}
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors ${current.style}`}
      >
        {current.label}
        <ChevronDown
          className={`h-3 w-3 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={handleCancel} />

          <div className="absolute right-0 z-20 mt-1.5 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
            {!pending ? (
              <div className="p-1">
                {STATUS_OPTIONS.map((opt) => {
                  const cfg = statusConfig[opt];
                  const isActive = opt === current.key;

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect(opt)}
                      className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
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
                    {statusConfig[pending].label}
                  </span>
                  ?
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="flex-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Confirm
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
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

interface Props {
  dentist: string;
  color: string;
  appointments: ScheduleAppointment[];
  completedCount: number;
  availabilityStatus?: string;
}

export function ScheduleColumn({
  dentist,
  color,
  appointments,
  completedCount,
  availabilityStatus = "available",
}: Props) {
  const normalizedAvailability =
    availabilityStatus.toLowerCase() as AvailabilityKey;

  const avail =
    availabilityConfig[normalizedAvailability] ?? availabilityConfig.available;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="space-y-3 border-b border-border px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            <h2 className="text-sm font-semibold text-foreground">{dentist}</h2>
          </div>

          <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
            {completedCount}/{appointments.length} done
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 shrink-0 rounded-full ${avail.color}`} />
          <span className="text-xs font-medium text-foreground">
            {avail.label}
          </span>
          <span className="text-xs text-muted-foreground">
            — {avail.message}
          </span>
        </div>
      </div>

      <div className="divide-y divide-border">
        {appointments.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No appointments today
          </div>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt.id}
              className="px-5 py-4 transition-colors hover:bg-secondary/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {appt.patientName}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {appt.treatment}
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {appt.time}
                    </span>

                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {appt.phone}
                    </span>
                  </div>
                </div>

                <StatusBadge
                  appointmentId={appt.id}
                  initialStatus={appt.status}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
