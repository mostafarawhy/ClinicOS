"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const NOTIFICATIONS = [
  {
    key: "newAppointment",
    label: "New appointment booked",
    description: "When a new appointment is scheduled",
  },
  {
    key: "cancellation",
    label: "Appointment cancellation",
    description: "When a patient cancels",
  },
  {
    key: "reminder",
    label: "Daily schedule reminder",
    description: "Summary of your appointments each morning",
  },
  {
    key: "patientUpdate",
    label: "Patient record updates",
    description: "When a patient profile is modified",
  },
];

export function NotificationsForm() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    newAppointment: true,
    cancellation: true,
    reminder: true,
    patientUpdate: false,
  });

  return (
    <div className="px-6 py-5 divide-y divide-border">
      {NOTIFICATIONS.map(({ key, label, description }) => (
        <div
          key={key}
          className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
        >
          <div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {description}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
              prefs[key] ? "bg-primary" : "bg-secondary",
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform",
                prefs[key] ? "translate-x-4" : "translate-x-0",
              )}
            />
          </button>
        </div>
      ))}
    </div>
  );
}
