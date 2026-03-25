import { format } from "date-fns";
import { getTodaySchedule } from "@/lib/queries/schedule";
import { ScheduleColumn } from "@/components/schedule/schedule-column";
import type { AppointmentStatus, TreatmentType } from "@prisma/client";

function formatTreatment(raw: TreatmentType): string {
  return raw
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatStatus(raw: AppointmentStatus): string {
  return raw.toLocaleLowerCase();
}

export default async function SchedulePage() {
  const dentists = await getTodaySchedule();

  const today = new Date();

  const totalToday = dentists.reduce(
    (sum, d) => sum + d.appointments.length,
    0,
  );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            {format(today, "EEEE, MMMM d, yyyy")}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalToday} total appointments today
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-muted-foreground">Live</span>
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
