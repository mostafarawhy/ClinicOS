import type { DentistOption } from "@/app/(dashboard)/calendar/calendar.config";

interface Props {
  dentists: DentistOption[];
  isAllDentistsView: boolean;
}

export function CalendarLegend({ dentists, isAllDentistsView }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-foreground">
          {isAllDentistsView ? "Clinic Overview" : "Dentist Schedule"}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {isAllDentistsView
            ? "All dentists — select a dentist above for full appointment details."
            : "Full appointment details for the selected dentist."}
        </p>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        {dentists.map((dentist) => (
          <div
            key={dentist.id}
            className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1"
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: dentist.color }}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {dentist.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
