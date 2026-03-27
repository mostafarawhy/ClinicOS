import Link from "next/link";
import { format, addDays, subDays, isValid, parseISO } from "date-fns";
import { getScheduleForDate } from "@/lib/queries/schedule";
import { ScheduleColumn } from "@/components/schedule/schedule-column";
import type { AppointmentStatus, TreatmentType } from "@prisma/client";

function formatTreatment(raw: TreatmentType): string {
  return raw
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatStatus(raw: AppointmentStatus): string {
  return raw.toLowerCase();
}

function toDateParam(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function getSelectedDate(dateParam?: string): Date {
  if (!dateParam) {
    return new Date();
  }

  const parsed = parseISO(dateParam);

  if (!isValid(parsed)) {
    return new Date();
  }

  return parsed;
}

type SchedulePageProps = {
  searchParams?: Promise<{
    date?: string;
  }>;
};

export default async function SchedulePage({
  searchParams,
}: SchedulePageProps) {
  const params = await searchParams;
  const selectedDate = getSelectedDate(params?.date);

  const dentists = await getScheduleForDate(selectedDate);

  const totalAppointments = dentists.reduce(
    (sum, dentist) => sum + dentist.appointments.length,
    0,
  );

  const prevDate = subDays(selectedDate, 1);
  const nextDate = addDays(selectedDate, 1);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {format(selectedDate, "EEEE, MMMM d, yyyy")}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {totalAppointments} total appointments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs text-muted-foreground">Live</span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/schedule?date=${toDateParam(prevDate)}`}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              Previous
            </Link>

            <Link
              href={`/schedule?date=${toDateParam(nextDate)}`}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
            >
              Next
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {dentists.map((dentist) => {
          const appointments = dentist.appointments.map((appt) => ({
            id: appt.id,
            patientName: appt.patient.fullName,
            phone: appt.patient.phone,
            treatment: formatTreatment(appt.treatmentType),
            time: appt.time,
            status: formatStatus(appt.status),
          }));

          const completedCount = appointments.filter(
            (a) => a.status === "completed",
          ).length;

          return (
            <ScheduleColumn
              key={dentist.id}
              dentist={dentist.name}
              color={dentist.color}
              appointments={appointments}
              completedCount={completedCount}
            />
          );
        })}
      </div>
    </div>
  );
}
