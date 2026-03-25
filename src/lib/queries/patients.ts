import { db } from "@/lib/db";
import type { PatientWithAppointments } from "@/types";

export async function getAllPatients(): Promise<PatientWithAppointments[]> {
  return db.patient.findMany({
    orderBy: { fullName: "asc" },
    include: {
      appointments: {
        orderBy: { date: "desc" },
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
}

export async function getPatientById(
  id: string,
): Promise<PatientWithAppointments | null> {
  return db.patient.findUnique({
    where: { id },
    include: {
      appointments: {
        orderBy: { date: "desc" },
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
}
