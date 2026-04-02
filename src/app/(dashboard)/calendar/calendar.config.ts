export const START_HOUR = 10;
export const END_HOUR = 20;
export const SLOT_HEIGHT = 52;
export const WEEK_LENGTH = 6;

export const SLOTS = Array.from(
  { length: (END_HOUR - START_HOUR) * 2 + 1 },
  (_, i) => {
    const h = START_HOUR + Math.floor(i / 2);
    const m = i % 2 === 0 ? "00" : "30";
    return `${h.toString().padStart(2, "0")}:${m}`;
  },
);

export const DAY_LABELS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu"];

export const DENTIST_STYLES: Record<string, string> = {
  "#2DD4BF": "bg-teal-50 border-teal-300 text-teal-900",
  "#818CF8": "bg-indigo-50 border-indigo-300 text-indigo-900",
  "#FB923C": "bg-orange-50 border-orange-300 text-orange-900",
};

export type DentistOption = {
  id: string;
  name: string;
  color: string;
};

export function timeToOffset(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h - START_HOUR) * 2 + m / 30;
}

export function formatTreatmentLabel(value: string): string {
  return value.toLowerCase().replace(/_/g, " ");
}
