import { getScheduleForDate } from "@/lib/queries/schedule";
import { ScheduleColumn } from "@/components/schedule/schedule-column";
import type { TreatmentType } from "@prisma/client";
import { ScheduleControls } from "./schedule-controls";
import { formatFullDate, fromDateParam } from "@/lib/datetime";
import { UnauthorizedBanner } from "./unauthorized-banner";

function formatTreatment(raw: TreatmentType): string {
  return raw
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

type SchedulePageProps = {
  searchParams?: Promise<{
    date?: string;
    unauthorized?: string;
  }>;
};

export default async function SchedulePage({
  searchParams,
}: SchedulePageProps) {
  const params = await searchParams;
  const selectedDate = fromDateParam(params?.date);
  const isUnauthorized = params?.unauthorized === "true";

  const dentists = await getScheduleForDate(selectedDate);

  const totalAppointments = dentists.reduce(
    (sum, dentist) => sum + dentist.appointments.length,
    0,
  );

  return (
    <div>
      {isUnauthorized && <UnauthorizedBanner />}

      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {formatFullDate(selectedDate)}
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

          <ScheduleControls selectedDate={selectedDate} />
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
            status: appt.status,
          }));

          const completedCount = appointments.filter(
            (a) => a.status === "COMPLETED",
          ).length;

          return (
            <ScheduleColumn
              key={dentist.id}
              dentist={dentist.name}
              color={dentist.color}
              appointments={appointments}
              completedCount={completedCount}
              availabilityStatus={dentist.user.availabilityStatus}
            />
          );
        })}
      </div>
    </div>
  );
}
