import { getWeekAppointments } from "@/lib/queries/calendar";
import { CalendarClient } from "./calendar-client";
import { CalendarControls } from "./calendar-controls";
import { fromDateParam, getWeekDisplayRange } from "@/lib/datetime";

type CalendarPageProps = {
  searchParams?: Promise<{
    date?: string;
  }>;
};

export default async function CalendarPage({
  searchParams,
}: CalendarPageProps) {
  const params = await searchParams;
  const selectedDate = fromDateParam(params?.date);

  const appointments = await getWeekAppointments(selectedDate);
  const { start: weekStart, end: weekEnd } = getWeekDisplayRange(selectedDate);

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
