import { addDays, isValid, parseISO, startOfWeek } from "date-fns";
import { getWeekAppointments } from "@/lib/queries/calendar";
import { CalendarClient } from "./calendar-client";
import { CalendarControls } from "./calendar-controls";

function getSelectedDate(dateParam?: string): Date {
  if (!dateParam) return new Date();

  const parsed = parseISO(dateParam);
  return isValid(parsed) ? parsed : new Date();
}

type CalendarPageProps = {
  searchParams?: Promise<{
    date?: string;
  }>;
};

export default async function CalendarPage({
  searchParams,
}: CalendarPageProps) {
  const params = await searchParams;
  const selectedDate = getSelectedDate(params?.date);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 6 });
  weekStart.setHours(0, 0, 0, 0);

  // exclusive end boundary: Friday 00:00
  const weekEnd = addDays(weekStart, 6);
  weekEnd.setHours(0, 0, 0, 0);

  const appointments = await getWeekAppointments(weekStart, weekEnd);

  return (
    <div className="space-y-4">
      <CalendarControls selectedDate={selectedDate} weekStart={weekStart} />

      <CalendarClient
        appointments={appointments}
        weekStart={weekStart}
        weekEnd={weekEnd}
      />
    </div>
  );
}
