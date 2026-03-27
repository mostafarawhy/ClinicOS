import { db } from "@/lib/db";
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns";

export type StatCards = {
  totalPatients: number;
  appointmentsThisMonth: number;
  completionRate: number;
  noShowRate: number;
};

export type WeeklyDay = {
  day: string;
  count: number;
};

export type TreatmentSlice = {
  name: string;
  value: number;
  fill: string;
};

export type MonthlyPoint = {
  month: string;
  count: number;
};

export type AnalyticsData = {
  stats: StatCards;
  weekly: WeeklyDay[];
  treatments: TreatmentSlice[];
  monthly: MonthlyPoint[];
};

const TREATMENT_COLORS: Record<string, string> = {
  CLEANING: "#2DD4BF",
  FILLING: "#818CF8",
  EXTRACTION: "#FB923C",
  ROOT_CANAL: "#F472B6",
  CHECKUP: "#4ADE80",
  CROWN: "#FACC15",
  WHITENING: "#38BDF8",
  ORTHODONTICS: "#C084FC",
  IMPLANT: "#F87171",
  CONSULTATION: "#94A3B8",
  OTHER: "#64748B",
};

const TREATMENT_LABELS: Record<string, string> = {
  CLEANING: "Cleaning",
  FILLING: "Filling",
  EXTRACTION: "Extraction",
  ROOT_CANAL: "Root Canal",
  CHECKUP: "Checkup",
  CROWN: "Crown",
  WHITENING: "Whitening",
  ORTHODONTICS: "Orthodontics",
  IMPLANT: "Implant",
  CONSULTATION: "Consultation",
  OTHER: "Other",
};

const WEEK_DAY_LABELS: Record<number, string> = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
};

export async function getAnalyticsData(): Promise<AnalyticsData> {
  const now = new Date();

  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const weekStart = startOfWeek(now, { weekStartsOn: 6 });
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = endOfWeek(now, { weekStartsOn: 6 });
  weekEnd.setHours(23, 59, 59, 999);

  const [
    totalPatients,
    monthlyAppointments,
    weeklyAppointments,
    treatmentCounts,
    last8MonthsRaw,
  ] = await Promise.all([
    db.patient.count(),

    db.appointment.findMany({
      where: { date: { gte: monthStart, lte: monthEnd } },
      select: { status: true },
    }),

    db.appointment.findMany({
      where: { date: { gte: weekStart, lte: weekEnd } },
      select: { date: true },
    }),

    db.appointment.groupBy({
      by: ["treatmentType"],
      _count: { treatmentType: true },
    }),

    db.appointment.findMany({
      where: {
        date: {
          gte: startOfMonth(subMonths(now, 7)),
          lte: monthEnd,
        },
      },
      select: { date: true },
    }),
  ]);

  const totalThisMonth = monthlyAppointments.length;
  const completed = monthlyAppointments.filter(
    (a) => a.status === "COMPLETED",
  ).length;
  const noShow = monthlyAppointments.filter(
    (a) => a.status === "NO_SHOW",
  ).length;

  const completionRate =
    totalThisMonth > 0 ? Math.round((completed / totalThisMonth) * 100) : 0;
  const noShowRate =
    totalThisMonth > 0 ? Math.round((noShow / totalThisMonth) * 100) : 0;

  const weeklyMap: Record<number, number> = {};
  for (const appt of weeklyAppointments) {
    const dayIndex = new Date(appt.date).getDay();
    weeklyMap[dayIndex] = (weeklyMap[dayIndex] ?? 0) + 1;
  }

  const WORK_WEEK_ORDER = [6, 0, 1, 2, 3, 4];
  const weekly: WeeklyDay[] = WORK_WEEK_ORDER.map((dayIndex) => ({
    day: WEEK_DAY_LABELS[dayIndex],
    count: weeklyMap[dayIndex] ?? 0,
  }));

  const totalTreatments = treatmentCounts.reduce(
    (sum, t) => sum + t._count.treatmentType,
    0,
  );
  const treatments: TreatmentSlice[] = treatmentCounts.map((t) => ({
    name: TREATMENT_LABELS[t.treatmentType] ?? t.treatmentType,
    value:
      totalTreatments > 0
        ? Math.round((t._count.treatmentType / totalTreatments) * 100)
        : 0,
    fill: TREATMENT_COLORS[t.treatmentType] ?? "#64748B",
  }));

  const monthlyMap: Record<string, number> = {};
  for (const appt of last8MonthsRaw) {
    const key = new Date(appt.date).toLocaleDateString("en-US", {
      month: "short",
    });
    monthlyMap[key] = (monthlyMap[key] ?? 0) + 1;
  }

  const monthly: MonthlyPoint[] = Array.from({ length: 8 }, (_, i) => {
    const d = subMonths(now, 7 - i);
    const key = d.toLocaleDateString("en-US", { month: "short" });
    return { month: key, count: monthlyMap[key] ?? 0 };
  });

  return {
    stats: {
      totalPatients,
      appointmentsThisMonth: totalThisMonth,
      completionRate,
      noShowRate,
    },
    weekly,
    treatments,
    monthly,
  };
}
