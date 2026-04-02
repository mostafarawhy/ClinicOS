import { db } from "@/lib/db";
import { getUtcDayRange } from "@/lib/datetime";
import type { DentistWithAppointments } from "@/types";

export async function getScheduleForDate(
  selectedDate: Date,
): Promise<DentistWithAppointments[]> {
  const { start, end } = getUtcDayRange(selectedDate);

  const dentists = await db.dentist.findMany({
    orderBy: { name: "asc" },
    include: {
      user: {
        select: {
          availabilityStatus: true,
          id: true,
          name: true,
        },
      },
      appointments: {
        where: {
          date: {
            gte: start,
            lt: end,
          },
        },
        orderBy: { time: "asc" },
        include: {
          patient: {
            select: { id: true, fullName: true, phone: true },
          },
          dentist: {
            select: { id: true, name: true, color: true },
          },
          createdBy: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });

  return dentists;
}
