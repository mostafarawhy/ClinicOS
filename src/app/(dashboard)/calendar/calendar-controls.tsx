"use client";

import { useRouter } from "next/navigation";
import { addDays, format, subDays } from "date-fns";
import { getTodayDateParam, toDateParam } from "@/lib/datetime";

interface Props {
  selectedDate: Date;
  weekStart: Date;
}

export function CalendarControls({ selectedDate, weekStart }: Props) {
  const router = useRouter();

  const previousWeek = subDays(weekStart, 7);
  const nextWeek = addDays(weekStart, 7);

  function navigateToDate(dateParam: string) {
    router.replace(`/calendar?date=${dateParam}`);
    router.refresh();
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (!value) return;

    navigateToDate(value);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          Weekly Calendar
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {format(weekStart, "MMM d")} –{" "}
          {format(addDays(weekStart, 5), "MMM d, yyyy")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => navigateToDate(toDateParam(previousWeek))}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
        >
          Previous Week
        </button>

        <button
          type="button"
          onClick={() => navigateToDate(getTodayDateParam())}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
        >
          Today
        </button>

        <input
          type="date"
          value={toDateParam(selectedDate)}
          onChange={handleDateChange}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />

        <button
          type="button"
          onClick={() => navigateToDate(toDateParam(nextWeek))}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
        >
          Next Week
        </button>
      </div>
    </div>
  );
}
