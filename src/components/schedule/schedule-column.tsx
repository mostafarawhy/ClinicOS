"use client";

import { Clock, Phone } from "lucide-react";
import type { AppointmentStatus } from "@prisma/client";
import StatusBadge from "./status-badge";

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
  status: AppointmentStatus;
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
    <div className="relative overflow-visible rounded-xl border border-border bg-card">
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
              className="relative px-5 py-4 transition-colors hover:bg-secondary/40"
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
