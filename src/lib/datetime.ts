import {
  addDays,
  endOfDay,
  format,
  isValid,
  startOfDay,
  startOfWeek,
} from "date-fns";

export function toDateParam(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function getTodayDateParam(): string {
  return toDateParam(new Date());
}

export function getTodayDate(): Date {
  return fromDateParam(getTodayDateParam());
}

export function fromDateParam(dateParam?: string): Date {
  if (!dateParam) {
    return getTodayDate();
  }

  const [year, month, day] = dateParam.split("-").map(Number);
  const parsed = new Date(year, month - 1, day, 12, 0, 0);

  if (!isValid(parsed)) {
    return getTodayDate();
  }

  return parsed;
}

export function getDayRange(date: Date) {
  return {
    start: startOfDay(date),
    end: endOfDay(date),
  };
}

export function getWeekDisplayRange(date: Date) {
  const weekStart = startOfWeek(date, { weekStartsOn: 6 });
  const start = startOfDay(weekStart);
  const end = startOfDay(addDays(start, 6));

  return {
    start,
    end,
  };
}

/* DB UTC day range */
export function getUtcDayRange(date: Date) {
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  return { start, end };
}

/* DB UTC week range */
export function getUtcWeekRange(date: Date) {
  const weekStartLocal = startOfWeek(date, { weekStartsOn: 6 });

  const start = new Date(weekStartLocal);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 7);

  return { start, end };
}

export function formatFullDate(date: Date): string {
  return format(date, "EEEE, MMMM d, yyyy");
}
