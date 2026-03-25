"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { TreatmentType } from "@prisma/client";
import { revalidatePath } from "next/cache";

const TREATMENT_MAP: Record<string, TreatmentType> = {
  Cleaning: "CLEANING",
  Filling: "FILLING",
  Extraction: "EXTRACTION",
  "Root Canal": "ROOT_CANAL",
  Whitening: "WHITENING",
  Crown: "CROWN",
  Consultation: "CONSULTATION",
  Checkup: "CHECKUP",
  Orthodontics: "ORTHODONTICS",
  Implant: "IMPLANT",
  Other: "OTHER",
};

export type AppointmentActionState = {
  error?: string;
  success?: boolean;
};

export async function createAppointment(
  _prev: AppointmentActionState,
  formData: FormData,
): Promise<AppointmentActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be logged in to book appointments." };
  }

  const patientName = formData.get("patientName")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const dentistId = formData.get("dentistId")?.toString().trim();
  const treatmentLabel = formData.get("treatment")?.toString().trim();
  const dateStr = formData.get("date")?.toString().trim();
  const time = formData.get("time")?.toString().trim();
  const notes = formData.get("notes")?.toString().trim() || undefined;

  if (
    !patientName ||
    !phone ||
    !email ||
    !dentistId ||
    !treatmentLabel ||
    !dateStr ||
    !time
  ) {
    return { error: "All required fields must be filled in." };
  }

  const treatmentType = TREATMENT_MAP[treatmentLabel];
  if (!treatmentType) {
    return { error: "Invalid treatment type selected." };
  }

  const dentist = await db.dentist.findUnique({
    where: { id: dentistId },
  });

  if (!dentist) {
    return { error: "Selected dentist does not exist." };
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  const appointmentDate = new Date(year, month - 1, day);
  appointmentDate.setHours(0, 0, 0, 0);

  if (Number.isNaN(appointmentDate.getTime())) {
    return { error: "Invalid appointment date." };
  }

  let patient = await db.patient.findFirst({
    where: { phone },
  });

  if (!patient) {
    patient = await db.patient.create({
      data: {
        fullName: patientName,
        phone,
        email,
      },
    });
  }

  await db.appointment.create({
    data: {
      date: appointmentDate,
      time,
      treatmentType,
      notes,
      patientId: patient.id,
      dentistId: dentist.id,
      createdById: session.user.id,
    },
  });

  revalidatePath("/schedule");
  revalidatePath("/appointments");

  return { success: true };
}
