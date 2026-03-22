import { Clock, Phone } from "lucide-react";

export type ScheduleAppointment = {
  id: string;
  patientName: string;
  phone: string;
  treatment: string;
  time: string;
  status: string;
};

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-400",
  upcoming: "bg-primary/10 text-primary",
  no_show: "bg-yellow-500/10 text-yellow-400",
  cancelled: "bg-red-500/10 text-red-400",
};

interface Props {
  dentist: string;
  color: string;
  appointments: ScheduleAppointment[];
  completedCount: number;
}

export function ScheduleColumn({
  dentist,
  color,
  appointments,
  completedCount,
}: Props) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <h2 className="font-semibold text-sm text-foreground">{dentist}</h2>
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
          {completedCount}/{appointments.length} done
        </span>
      </div>

      <div className="divide-y divide-border">
        {appointments.length === 0 ? (
          <div className="px-5 py-10 text-center text-sm text-muted-foreground">
            No appointments today
          </div>
        ) : (
          appointments.map((appt) => (
            <div
              key={appt.id}
              className="px-5 py-4 hover:bg-secondary/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {appt.patientName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {appt.treatment}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {appt.time}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {appt.phone}
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize shrink-0 ${
                    statusStyles[appt.status] ??
                    "bg-secondary text-muted-foreground"
                  }`}
                >
                  {appt.status.replace("_", " ")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
