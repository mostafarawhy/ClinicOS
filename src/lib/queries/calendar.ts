import { db } from "@/lib/db";
import { getUtcWeekRange } from "@/lib/datetime";
import type { AppointmentWithRelations } from "@/types";

export async function getWeekAppointments(
  selectedDate: Date,
  dentistId?: string,
): Promise<AppointmentWithRelations[]> {
  const { start, end } = getUtcWeekRange(selectedDate);

  return db.appointment.findMany({
    where: {
      date: {
        gte: start,
        lt: end,
      },
      status: {
        not: "CANCELLED",
      },
      ...(dentistId ? { dentistId } : {}),
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
