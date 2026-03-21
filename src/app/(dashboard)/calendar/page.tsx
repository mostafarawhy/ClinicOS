"use client";

import { cn } from "@/lib/utils";

const DENTISTS = [
  {
    name: "Dr. Ahmed Hassan",
    color: "#2DD4BF",
    style: "bg-teal-500/20 border-teal-500/40 text-teal-300",
  },
  {
    name: "Dr. Sara Mahmoud",
    color: "#818CF8",
    style: "bg-indigo-500/20 border-indigo-500/40 text-indigo-300",
  },
  {
    name: "Dr. Omar Khalil",
    color: "#FB923C",
    style: "bg-orange-500/20 border-orange-500/40 text-orange-300",
  },
];

const dentistStyle = Object.fromEntries(DENTISTS.map((d) => [d.name, d.style]));
const dentistColor = Object.fromEntries(DENTISTS.map((d) => [d.name, d.color]));

// Week: Sat 21 – Thu 26 March 2026 (Egyptian work week)
const WEEK_DAYS = [
  { label: "Sat", date: "2026-03-21" },
  { label: "Sun", date: "2026-03-22" },
  { label: "Mon", date: "2026-03-23" },
  { label: "Tue", date: "2026-03-24" },
  { label: "Wed", date: "2026-03-25" },
  { label: "Thu", date: "2026-03-26" },
];

const TODAY = "2026-03-21";

const appointments = [
  {
    id: "a1",
    date: "2026-03-21",
    time: "09:00",
    patientName: "Ahmed Hassan",
    treatment: "Cleaning",
    dentist: "Dr. Ahmed Hassan",
  },
  {
    id: "a2",
    date: "2026-03-21",
    time: "11:00",
    patientName: "Sara Mahmoud",
    treatment: "Filling",
    dentist: "Dr. Sara Mahmoud",
  },
  {
    id: "a3",
    date: "2026-03-21",
    time: "14:00",
    patientName: "Omar Khalil",
    treatment: "Consultation",
    dentist: "Dr. Omar Khalil",
  },
  {
    id: "a4",
    date: "2026-03-22",
    time: "10:00",
    patientName: "Nour El-Din",
    treatment: "Root Canal",
    dentist: "Dr. Ahmed Hassan",
  },
  {
    id: "a5",
    date: "2026-03-22",
    time: "13:00",
    patientName: "Layla Mostafa",
    treatment: "Whitening",
    dentist: "Dr. Sara Mahmoud",
  },
  {
    id: "a6",
    date: "2026-03-23",
    time: "08:00",
    patientName: "Karim Adel",
    treatment: "Crown",
    dentist: "Dr. Omar Khalil",
  },
  {
    id: "a7",
    date: "2026-03-23",
    time: "11:00",
    patientName: "Hana Samir",
    treatment: "Cleaning",
    dentist: "Dr. Ahmed Hassan",
  },
  {
    id: "a8",
    date: "2026-03-23",
    time: "15:00",
    patientName: "Youssef Fawzy",
    treatment: "Extraction",
    dentist: "Dr. Sara Mahmoud",
  },
  {
    id: "a9",
    date: "2026-03-24",
    time: "09:00",
    patientName: "Ahmed Hassan",
    treatment: "Filling",
    dentist: "Dr. Omar Khalil",
  },
  {
    id: "a10",
    date: "2026-03-25",
    time: "10:00",
    patientName: "Sara Mahmoud",
    treatment: "Consultation",
    dentist: "Dr. Ahmed Hassan",
  },
  {
    id: "a11",
    date: "2026-03-25",
    time: "13:00",
    patientName: "Omar Khalil",
    treatment: "Cleaning",
    dentist: "Dr. Sara Mahmoud",
  },
  {
    id: "a12",
    date: "2026-03-26",
    time: "09:00",
    patientName: "Nour El-Din",
    treatment: "Crown",
    dentist: "Dr. Ahmed Hassan",
  },
  {
    id: "a13",
    date: "2026-03-26",
    time: "14:00",
    patientName: "Karim Adel",
    treatment: "Root Canal",
    dentist: "Dr. Omar Khalil",
  },
];

const HOURS = Array.from({ length: 10 }, (_, i) => {
  const h = i + 8; // 08:00 – 17:00
  return `${h.toString().padStart(2, "0")}:00`;
});

const SLOT_HEIGHT = 60;
const START_HOUR = 8;

function timeToOffset(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return ((h - START_HOUR) * 60 + m) / 60;
}

export default function CalendarPage() {
  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        {DENTISTS.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-xs text-muted-foreground">{d.name}</span>
          </div>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">
          Week of Mar 21–26, 2026
        </span>
      </div>

      {/* Calendar grid */}
      <div className="rounded-xl border border-border bg-card overflow-auto">
        <div className="min-w-[700px]">
          {/* Day headers */}
          <div
            className="grid border-b border-border"
            style={{ gridTemplateColumns: "52px repeat(6, 1fr)" }}
          >
            <div className="border-r border-border" />
            {WEEK_DAYS.map(({ label, date }) => {
              const isToday = date === TODAY;
              return (
                <div
                  key={date}
                  className={cn(
                    "px-3 py-3 text-center border-r border-border last:border-r-0",
                    isToday && "bg-primary/5",
                  )}
                >
                  <p
                    className={cn(
                      "text-xs font-medium",
                      isToday ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-semibold mt-0.5",
                      isToday ? "text-primary" : "text-foreground",
                    )}
                  >
                    {date.slice(8)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Time grid */}
          <div
            className="relative grid"
            style={{ gridTemplateColumns: "52px repeat(6, 1fr)" }}
          >
            {/* Hour labels */}
            <div className="border-r border-border">
              {HOURS.map((h) => (
                <div
                  key={h}
                  style={{ height: SLOT_HEIGHT }}
                  className="flex items-start justify-end pr-2 pt-1.5"
                >
                  <span className="text-[11px] text-muted-foreground">{h}</span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {WEEK_DAYS.map(({ date }) => {
              const dayAppts = appointments.filter((a) => a.date === date);
              const isToday = date === TODAY;
              return (
                <div
                  key={date}
                  className={cn(
                    "relative border-r border-border last:border-r-0",
                    isToday && "bg-primary/[0.03]",
                  )}
                  style={{ height: SLOT_HEIGHT * HOURS.length }}
                >
                  {/* Hour lines */}
                  {HOURS.map((_, i) => (
                    <div
                      key={i}
                      className="absolute left-0 right-0 border-t border-border/40"
                      style={{ top: i * SLOT_HEIGHT }}
                    />
                  ))}

                  {/* Appointments */}
                  {dayAppts.map((appt) => {
                    const top = timeToOffset(appt.time) * SLOT_HEIGHT;
                    return (
                      <div
                        key={appt.id}
                        className={cn(
                          "absolute left-1 right-1 rounded border px-2 py-1.5 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity",
                          dentistStyle[appt.dentist] ??
                            "bg-secondary border-border text-foreground",
                        )}
                        style={{ top: top + 2, height: SLOT_HEIGHT - 6 }}
                        title={`${appt.patientName} — ${appt.treatment} (${appt.dentist})`}
                      >
                        <p className="text-xs font-medium leading-none truncate">
                          {appt.patientName}
                        </p>
                        <p className="text-[11px] opacity-60 mt-1 truncate">
                          {appt.time} · {appt.treatment}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
