"use client";

import { addDays, isSameDay } from "date-fns";
import type { AppointmentWithRelations } from "@/types";
import {
  WEEK_LENGTH,
  type DentistOption,
} from "@/app/(dashboard)/calendar/calendar.config";
import { CalendarLegend } from "@/app/(dashboard)/calendar/calendar-legend";
import { CalendarDayHeaders } from "@/app/(dashboard)/calendar/calendar-day-headers";
import { CalendarTimeGutter } from "@/app/(dashboard)/calendar/calendar-time-gutter";
import { CalendarDayColumn } from "@/app/(dashboard)/calendar/calendar-day-column";

interface Props {
  appointments: AppointmentWithRelations[];
  weekStart: Date;
  weekEnd: Date;
  dentists: DentistOption[];
  selectedDentistId?: string;
}

export function CalendarClient({
  appointments,
  weekStart,
  dentists,
  selectedDentistId,
}: Props) {
  const today = new Date();
  const isAllDentistsView = !selectedDentistId;

  const weekDays = Array.from({ length: WEEK_LENGTH }, (_, i) =>
    addDays(weekStart, i),
  );

  return (
    <div className="space-y-3">
      <CalendarLegend dentists={dentists} isAllDentistsView={isAllDentistsView} />

      <div className="overflow-auto rounded-xl border border-border bg-card">
        <div className="min-w-[760px]">
          <CalendarDayHeaders weekDays={weekDays} />

          <div
            className="relative grid"
            style={{ gridTemplateColumns: "56px repeat(6, minmax(0, 1fr))" }}
          >
            <CalendarTimeGutter />

            {weekDays.map((day) => (
              <CalendarDayColumn
                key={day.toISOString()}
                day={day}
                appointments={appointments}
                isAllDentistsView={isAllDentistsView}
                isToday={isSameDay(day, today)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
