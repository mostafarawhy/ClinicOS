import { db } from "@/lib/db";
import type { AppointmentWithRelations } from "@/types";

export async function getWeekAppointments(
  start: Date,
  end: Date,
): Promise<AppointmentWithRelations[]> {
  return db.appointment.findMany({
    where: {
      date: {
        gte: start,
        lt: end,
      },
    },
    orderBy: [{ date: "asc" }, { time: "asc" }],
    include: {
      patient: {
        select: {
          id: true,
          fullName: true,
          phone: true,
        },
      },
      dentist: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
