"use client";

import { useRouter } from "next/navigation";
import { addDays, format, subDays } from "date-fns";

interface Props {
  weekStart: Date;
}

function toDateParam(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function CalendarControls({ weekStart }: Props) {
  const router = useRouter();

  const previousWeek = subDays(weekStart, 7);
  const nextWeek = addDays(weekStart, 7);
  const today = new Date();

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (!value) return;

    router.push(`/calendar?date=${value}`);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-sm font-semibold text-foreground">
          Weekly Calendar
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          {format(weekStart, "MMM d")} –{" "}
          {format(addDays(weekStart, 5), "MMM d, yyyy")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() =>
            router.push(`/calendar?date=${toDateParam(previousWeek)}`)
          }
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
        >
          Previous Week
        </button>

        <button
          type="button"
          onClick={() => router.push(`/calendar?date=${toDateParam(today)}`)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
        >
          Today
        </button>

        <input
          type="date"
          defaultValue={toDateParam(weekStart)}
          onChange={handleDateChange}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />

        <button
          type="button"
          onClick={() => router.push(`/calendar?date=${toDateParam(nextWeek)}`)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
        >
          Next Week
        </button>
      </div>
    </div>
  );
}
