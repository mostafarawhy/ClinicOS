import { db } from "@/lib/db";
import type { DentistWithAppointments } from "@/types";

export async function getTodaySchedule(): Promise<DentistWithAppointments[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dentists = await db.dentist.findMany({
    orderBy: { name: "asc" },
    include: {
      appointments: {
        where: { date: today },
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
