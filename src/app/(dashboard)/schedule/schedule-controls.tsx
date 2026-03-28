"use client";

import Link from "next/link";
import { addDays, format, subDays } from "date-fns";
import { useRouter } from "next/navigation";

function toDateParam(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

interface Props {
  selectedDate: Date;
}

export function ScheduleControls({ selectedDate }: Props) {
  const router = useRouter();

  const prevDate = subDays(selectedDate, 1);
  const nextDate = addDays(selectedDate, 1);

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    if (!value) return;

    router.push(`/schedule?date=${value}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/schedule?date=${toDateParam(prevDate)}`}
        className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
      >
        Previous
      </Link>

      <input
        type="date"
        value={toDateParam(selectedDate)}
        onChange={handleDateChange}
        className="rounded-md border  border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
      />

      <Link
        href={`/schedule?date=${toDateParam(nextDate)}`}
        className="rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary"
      >
        Next
      </Link>
    </div>
  );
}
