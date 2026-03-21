"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const DENTISTS = ["Dr. Ahmed Hassan", "Dr. Sara Mahmoud", "Dr. Omar Khalil"];

const TREATMENTS = [
  "Cleaning",
  "Filling",
  "Extraction",
  "Root Canal",
  "Whitening",
  "Crown",
  "Consultation",
];

export default function AppointmentsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    patientName: "",
    phone: "",
    dentist: "",
    date: "",
    time: "",
    treatment: "",
    notes: "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({
        patientName: "",
        phone: "",
        dentist: "",
        date: "",
        time: "",
        treatment: "",
        notes: "",
      });
    }, 2500);
  }

  const inputClass =
    "w-full rounded-md border border-border bg-input px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition";
  const labelClass =
    "block text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Book New Appointment
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Fill in the details to schedule a patient visit
          </p>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <CheckCircle2 className="h-12 w-12 text-primary" />
            <div className="text-center">
              <p className="font-semibold text-foreground">
                Appointment Booked
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                The appointment has been added to the schedule.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
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
                  value={form.patientName}
                  onChange={handleChange}
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
                  value={form.phone}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="dentist" className={labelClass}>
                  Dentist
                </label>
                <select
                  id="dentist"
                  name="dentist"
                  required
                  value={form.dentist}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select dentist</option>
                  {DENTISTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
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
                  value={form.treatment}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select treatment</option>
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
                  value={form.date}
                  onChange={handleChange}
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
                  value={form.time}
                  onChange={handleChange}
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
                value={form.notes}
                onChange={handleChange}
                className={inputClass + " resize-none"}
              />
            </div>

            <div className="pt-1">
              <button
                type="submit"
                className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Book Appointment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
