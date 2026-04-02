import { db } from "@/lib/db";
import { getWeekAppointments } from "@/lib/queries/calendar";
import { CalendarClient } from "./calendar-client";
import { CalendarControls } from "./calendar-controls";
import { fromDateParam, getWeekDisplayRange } from "@/lib/datetime";

type CalendarPageProps = {
  searchParams?: Promise<{
    date?: string;
    dentistId?: string;
  }>;
};

export default async function CalendarPage({
  searchParams,
}: CalendarPageProps) {
  const params = await searchParams;
  const selectedDate = fromDateParam(params?.date);
  const selectedDentistId = params?.dentistId;

  const [appointments, dentists] = await Promise.all([
    getWeekAppointments(selectedDate, selectedDentistId),
    db.dentist.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        color: true,
      },
    }),
  ]);

  const { start: weekStart, end: weekEnd } = getWeekDisplayRange(selectedDate);

  return (
    <div className="space-y-4">
      <CalendarControls
        selectedDate={selectedDate}
        weekStart={weekStart}
        dentists={dentists}
        selectedDentistId={selectedDentistId}
      />

      <CalendarClient
        appointments={appointments}
        weekStart={weekStart}
        weekEnd={weekEnd}
        dentists={dentists}
        selectedDentistId={selectedDentistId}
      />
    </div>
  );
}
