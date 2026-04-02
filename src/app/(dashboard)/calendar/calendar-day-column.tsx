import { cn } from "@/lib/utils";
import { isSameDay } from "date-fns";
import type { AppointmentWithRelations } from "@/types";
import {
  SLOTS,
  SLOT_HEIGHT,
  DENTIST_STYLES,
  timeToOffset,
  formatTreatmentLabel,
} from "@/app/(dashboard)/calendar/calendar.config";

interface Props {
  day: Date;
  appointments: AppointmentWithRelations[];
  isAllDentistsView: boolean;
  isToday: boolean;
}

export function CalendarDayColumn({
  day,
  appointments,
  isAllDentistsView,
  isToday,
}: Props) {
  const dayAppointments = appointments
    .filter((appt) => isSameDay(new Date(appt.date), day))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div
      className={cn(
        "relative border-r border-border last:border-r-0",
        isToday && "bg-primary/[0.03]",
      )}
      style={{ height: SLOT_HEIGHT * SLOTS.length }}
    >
      {/* Hour / half-hour grid lines */}
      {SLOTS.map((slot, index) => (
        <div
          key={slot}
          className={cn(
            "absolute left-0 right-0 border-t",
            slot.endsWith(":00") ? "border-border" : "border-border/30",
          )}
          style={{ top: index * SLOT_HEIGHT }}
        />
      ))}

      {/* ── ALL DENTISTS VIEW ── */}
      {isAllDentistsView
        ? dayAppointments.map((appt) => {
            const sameTime = dayAppointments.filter(
              (a) => a.time === appt.time,
            );
            const col = sameTime.indexOf(appt);
            const total = sameTime.length;
            const widthPct = 100 / total;
            const leftPct = col * widthPct;
            const top = timeToOffset(appt.time) * SLOT_HEIGHT;

            return (
              <div
                key={appt.id}
                className="absolute overflow-hidden rounded border border-border/50 bg-card shadow-sm"
                style={{
                  top: top + 2,
                  height: SLOT_HEIGHT - 6,
                  left: `calc(${leftPct}% + 2px)`,
                  width: `calc(${widthPct}% - 4px)`,
                  borderLeftWidth: "3px",
                  borderLeftColor: appt.dentist.color,
                }}
                title={`${appt.time} — ${appt.dentist.name} — ${appt.patient.fullName}`}
              >
                <div className="px-1.5 pt-1">
                  <p className="truncate text-[11px] font-semibold leading-none text-foreground">
                    {appt.patient.fullName}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] leading-none text-muted-foreground">
                    {appt.time}
                  </p>
                </div>
              </div>
            );
          })

        /* ── SINGLE DENTIST VIEW ── */
        : dayAppointments.map((appt) => {
            const top = timeToOffset(appt.time) * SLOT_HEIGHT;
            const colorStyle =
              DENTIST_STYLES[appt.dentist.color] ??
              "border-border bg-secondary text-foreground";

            return (
              <div
                key={appt.id}
                className={cn(
                  "absolute left-1 right-1 overflow-hidden rounded-md border px-2 py-1.5 shadow-sm transition-opacity hover:opacity-90",
                  colorStyle,
                )}
                style={{
                  top: top + 2,
                  height: SLOT_HEIGHT - 4,
                }}
                title={`${appt.patient.fullName} — ${appt.treatmentType} (${appt.dentist.name})`}
              >
                <p className="truncate text-[11px] font-semibold leading-none">
                  {appt.patient.fullName}
                </p>
                <p className="mt-1 truncate text-[10px] leading-none opacity-75">
                  {appt.time} · {formatTreatmentLabel(appt.treatmentType)}
                </p>
              </div>
            );
          })}
    </div>
  );
}
