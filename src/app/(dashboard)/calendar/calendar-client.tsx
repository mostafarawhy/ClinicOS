"use client";

import { cn } from "@/lib/utils";
import { format, addDays, isSameDay } from "date-fns";
import type { AppointmentWithRelations } from "@/types";

const START_HOUR = 10;
const END_HOUR = 20;
const SLOT_HEIGHT = 52; // px per 30-min slot
const WEEK_LENGTH = 6;

// Half-hour slots: "10:00", "10:30", "11:00", ... "20:00"  (21 entries)
const SLOTS = Array.from({ length: (END_HOUR - START_HOUR) * 2 + 1 }, (_, i) => {
  const h = START_HOUR + Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${h.toString().padStart(2, "0")}:${m}`;
});

const DAY_LABELS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];

const DENTIST_STYLES: Record<string, string> = {
  "#2DD4BF": "bg-teal-500/20 border-teal-500/40 text-teal-300",
  "#818CF8": "bg-indigo-500/20 border-indigo-500/40 text-indigo-300",
  "#FB923C": "bg-orange-500/20 border-orange-500/40 text-orange-300",
};

function timeToOffset(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h - START_HOUR) * 2 + m / 30;
}

interface Props {
  appointments: AppointmentWithRelations[];
  weekStart: Date;
  weekEnd: Date;
}

export function CalendarClient({ appointments, weekStart }: Props) {
  const today = new Date();

  const weekDays = Array.from({ length: WEEK_LENGTH }, (_, i) =>
    addDays(weekStart, i),
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        {Object.entries(DENTIST_STYLES).map(([color]) => (
          <div key={color} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
          </div>
        ))}

        <span className="ml-auto text-xs text-muted-foreground">
          Week of {format(weekStart, "MMM d")}–
          {format(addDays(weekStart, 5), "MMM d, yyyy")}
        </span>
      </div>

      <div className="overflow-auto rounded-xl border border-border bg-card">
        <div className="min-w-[700px]">
          <div
            className="grid border-b border-border"
            style={{ gridTemplateColumns: "52px repeat(6, 1fr)" }}
          >
            <div className="border-r border-border" />

            {weekDays.map((day, i) => {
              const isToday = isSameDay(day, today);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "border-r border-border px-3 py-3 text-center last:border-r-0",
                    isToday && "bg-primary/5",
                  )}
                >
                  <p
                    className={cn(
                      "text-xs font-medium",
                      isToday ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {DAY_LABELS[i]}
                  </p>

                  <p
                    className={cn(
                      "mt-0.5 text-sm font-semibold",
                      isToday ? "text-primary" : "text-foreground",
                    )}
                  >
                    {format(day, "d")}
                  </p>
                </div>
              );
            })}
          </div>

          <div
            className="relative grid"
            style={{ gridTemplateColumns: "52px repeat(6, 1fr)" }}
          >
            <div className="border-r border-border">
              {SLOTS.map((slot) => (
                <div
                  key={slot}
                  style={{ height: SLOT_HEIGHT }}
                  className="flex items-start justify-end pr-2 pt-1"
                >
                  <span
                    className={cn(
                      "text-[10px]",
                      slot.endsWith(":00")
                        ? "text-muted-foreground"
                        : "text-muted-foreground/40",
                    )}
                  >
                    {slot}
                  </span>
                </div>
              ))}
            </div>

            {weekDays.map((day) => {
              const dayAppts = appointments.filter((a) =>
                isSameDay(new Date(a.date), day),
              );

              const isToday = isSameDay(day, today);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "relative border-r border-border last:border-r-0",
                    isToday && "bg-primary/[0.03]",
                  )}
                  style={{ height: SLOT_HEIGHT * SLOTS.length }}
                >
                  {SLOTS.map((slot, i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute left-0 right-0 border-t",
                        slot.endsWith(":00") ? "border-border/40" : "border-border/20",
                      )}
                      style={{ top: i * SLOT_HEIGHT }}
                    />
                  ))}

                  {dayAppts.map((appt) => {
                    const top = timeToOffset(appt.time) * SLOT_HEIGHT;

                    const style =
                      DENTIST_STYLES[appt.dentist.color] ??
                      "border-border bg-secondary text-foreground";

                    return (
                      <div
                        key={appt.id}
                        className={cn(
                          "absolute left-1 right-1 overflow-hidden rounded border px-1.5 py-1 transition-opacity hover:opacity-90",
                          style,
                        )}
                        style={{
                          top: top + 2,
                          height: SLOT_HEIGHT - 6,
                        }}
                        title={`${appt.patient.fullName} — ${appt.treatmentType} (${appt.dentist.name})`}
                      >
                        <p className="truncate text-[11px] font-medium leading-none">
                          {appt.patient.fullName}
                        </p>

                        <p className="mt-0.5 truncate text-[10px] opacity-60 leading-none">
                          {appt.time} · {appt.treatmentType}
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
