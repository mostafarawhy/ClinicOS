import { appointments } from "@/lib/data";
import { ScheduleColumn } from "./schedule-column";

const TODAY = "2025-03-19";

export default function SchedulePage() {
  const todayAppts = appointments.filter((a) => a.date === TODAY);
  const aliAppts = todayAppts
    .filter((a) => a.dentist === "Dr. Ali")
    .sort((a, b) => a.time.localeCompare(b.time));
  const raniaAppts = todayAppts
    .filter((a) => a.dentist === "Dr. Rania")
    .sort((a, b) => a.time.localeCompare(b.time));

  const completedAli = aliAppts.filter((a) => a.status === "completed").length;
  const completedRania = raniaAppts.filter(
    (a) => a.status === "completed",
  ).length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">
            Wednesday, March 19, 2025
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {todayAppts.length} total appointments today
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <ScheduleColumn
          dentist="Dr. Ali"
          color="#3B82F6"
          appointments={aliAppts}
          completedCount={completedAli}
        />
        <ScheduleColumn
          dentist="Dr. Rania"
          color="#2DD4BF"
          appointments={raniaAppts}
          completedCount={completedRania}
        />
      </div>
    </div>
  );
}
