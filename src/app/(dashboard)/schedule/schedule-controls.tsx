"use client";

import { addDays, subDays } from "date-fns";
import { useRouter } from "next/navigation";
import { getTodayDateParam, toDateParam } from "@/lib/datetime";

interface Props {
  selectedDate: Date;
}

export function ScheduleControls({ selectedDate }: Props) {
  const router = useRouter();

  const prevDate = subDays(selectedDate, 1);
  const nextDate = addDays(selectedDate, 1);

  function navigateToDate(dateParam: string) {
    router.replace(`/schedule?date=${dateParam}`);
    router.refresh();
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (!value) return;

    navigateToDate(value);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => navigateToDate(toDateParam(prevDate))}
        className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
      >
        Previous
      </button>

      <button
        type="button"
        onClick={() => navigateToDate(getTodayDateParam())}
        className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
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
        onClick={() => navigateToDate(toDateParam(nextDate))}
        className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
      >
        Next
      </button>
    </div>
  );
}
