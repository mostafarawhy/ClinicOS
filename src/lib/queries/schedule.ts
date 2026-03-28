import { db } from "@/lib/db";
import type { DentistWithAppointments } from "@/types";

export async function getScheduleForDate(
  selectedDate: Date,
): Promise<DentistWithAppointments[]> {
  const start = new Date(selectedDate);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

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
