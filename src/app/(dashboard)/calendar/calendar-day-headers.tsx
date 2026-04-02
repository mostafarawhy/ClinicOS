import { cn } from "@/lib/utils";
import { format, isSameDay } from "date-fns";
import { DAY_LABELS } from "@/app/(dashboard)/calendar/calendar.config";

interface Props {
  weekDays: Date[];
}

export function CalendarDayHeaders({ weekDays }: Props) {
  const today = new Date();

  return (
    <div
      className="grid border-b border-border"
      style={{ gridTemplateColumns: "56px repeat(6, minmax(0, 1fr))" }}
    >
      <div className="border-r border-border" />

      {weekDays.map((day, i) => {
        const isToday = isSameDay(day, today);

        return (
          <div
            key={day.toISOString()}
            className={cn(
              "border-r border-border px-3 py-3 text-center last:border-r-0",
              isToday && "bg-primary/5",
            )}
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {DAY_LABELS[i]}
            </p>
            <div className="mt-1 flex items-center justify-center">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold",
                  isToday
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground",
                )}
              >
                {format(day, "d")}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
