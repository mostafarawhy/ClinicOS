import { addDays, startOfWeek } from "date-fns";
import { getWeekAppointments } from "@/lib/queries/calendar";
import { CalendarClient } from "./calendar-client";

export default async function CalendarPage() {
  const today = new Date();

  const weekStart = startOfWeek(today, { weekStartsOn: 6 });
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = addDays(weekStart, 6);
  weekEnd.setHours(0, 0, 0, 0);

  const appointments = await getWeekAppointments(weekStart, weekEnd);

  return (
    <CalendarClient
      appointments={appointments}
      weekStart={weekStart}
      weekEnd={weekEnd}
    />
  );
}
