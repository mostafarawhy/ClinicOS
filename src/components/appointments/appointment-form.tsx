"use client";

import { useActionState } from "react";
import { CheckCircle2 } from "lucide-react";
import { createAppointment } from "@/lib/actions/appointments";
import type { AppointmentActionState } from "@/lib/actions/appointments";

const TREATMENTS = [
  "Cleaning",
  "Filling",
  "Extraction",
  "Root Canal",
  "Whitening",
  "Crown",
  "Consultation",
  "Checkup",
  "Orthodontics",
  "Implant",
  "Other",
];

type Dentist = {
  id: string;
  name: string;
};

interface Props {
  dentists: Dentist[];
}

const initialState: AppointmentActionState = {};

const inputClass =
  "w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition";
const labelClass =
  "block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5";

export function AppointmentForm({ dentists }: Props) {
  const [state, formAction, isPending] = useActionState(
    createAppointment,
    initialState,
  );

  if (state.success) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <div className="text-center">
          <p className="font-semibold text-foreground">Appointment Booked</p>
          <p className="text-sm text-muted-foreground mt-1">
            The appointment has been added to the schedule.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="px-6 py-5 space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="patientName" className={labelClass}>
            Patient Name
          </label>
          <input
            id="patientName"
            name="patientName"
            type="text"
            required
            placeholder="Full name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Phone Number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="01XXXXXXXXX"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="text"
            required
            placeholder="Email"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="dentistId" className={labelClass}>
            Dentist
          </label>
          <select
            id="dentistId"
            name="dentistId"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Select dentist
            </option>
            {dentists.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="treatment" className={labelClass}>
            Treatment Type
          </label>
          <select
            id="treatment"
            name="treatment"
            required
            defaultValue=""
            className={inputClass}
          >
            <option value="" disabled>
              Select treatment
            </option>
            {TREATMENTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="date" className={labelClass}>
            Date
          </label>
          <input
            id="date"
            name="date"
            type="date"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="time" className={labelClass}>
            Time
          </label>
          <input
            id="time"
            name="time"
            type="time"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Notes (optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Any special instructions or patient notes..."
          className={inputClass + " resize-none"}
        />
      </div>

      {state.error && (
        <p className="text-xs text-destructive font-medium">{state.error}</p>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {isPending ? "Booking..." : "Book Appointment"}
        </button>
      </div>
    </form>
  );
}
