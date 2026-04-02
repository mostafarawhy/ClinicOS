import { SLOTS, SLOT_HEIGHT } from "@/app/(dashboard)/calendar/calendar.config";

export function CalendarTimeGutter() {
  return (
    <div className="border-r border-border bg-muted/10">
      {SLOTS.map((slot) => (
        <div
          key={slot}
          style={{ height: SLOT_HEIGHT }}
          className="flex items-start justify-end pr-2 pt-1"
        >
          {slot.endsWith(":00") && (
            <span className="text-[10px] font-medium text-muted-foreground">
              {slot}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
