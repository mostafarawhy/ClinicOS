"use client";

import { useRouter } from "next/navigation";
import { addDays, format, subDays } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getTodayDateParam, toDateParam } from "@/lib/datetime";

type DentistOption = {
  id: string;
  name: string;
  color: string;
};

interface Props {
  selectedDate: Date;
  weekStart: Date;
  dentists: DentistOption[];
  selectedDentistId?: string;
}

export function CalendarControls({
  selectedDate,
  weekStart,
  dentists,
  selectedDentistId,
}: Props) {
  const router = useRouter();

  const previousWeek = subDays(weekStart, 7);
  const nextWeek = addDays(weekStart, 7);

  function buildUrl(dateParam: string, dentistId?: string) {
    const params = new URLSearchParams();
    params.set("date", dateParam);

    if (dentistId) {
      params.set("dentistId", dentistId);
    }

    return `/calendar?${params.toString()}`;
  }

  function navigate(dateParam: string, dentistId?: string) {
    router.replace(buildUrl(dateParam, dentistId));
    router.refresh();
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!value) return;

    navigate(value, selectedDentistId);
  }

  function handleDentistChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value || undefined;
    navigate(toDateParam(selectedDate), value);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        {/* Title + date range */}
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            Weekly Calendar
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {format(weekStart, "MMM d")} –{" "}
            {format(addDays(weekStart, 5), "MMM d, yyyy")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Dentist filter */}
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-xs font-medium text-muted-foreground">
              Dentist
            </label>
            <select
              value={selectedDentistId ?? ""}
              onChange={handleDentistChange}
              className="min-w-[160px] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">All Dentists</option>
              {dentists.map((dentist) => (
                <option key={dentist.id} value={dentist.id}>
                  {dentist.name}
                </option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <div className="hidden h-5 w-px bg-border xl:block" />

          {/* Week navigation */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                navigate(toDateParam(previousWeek), selectedDentistId)
              }
              aria-label="Previous week"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => navigate(getTodayDateParam(), selectedDentistId)}
              className="h-9 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(toDateParam(nextWeek), selectedDentistId)
              }
              aria-label="Next week"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Date picker */}
          <input
            type="date"
            value={toDateParam(selectedDate)}
            onChange={handleDateChange}
            className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}
