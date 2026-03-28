"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { AppointmentStatus } from "@prisma/client";

export type UpdateAppointmentStatusResult = {
  success?: boolean;
  error?: string;
};

function isValidAppointmentStatus(value: string): value is AppointmentStatus {
  return (
    value === "UPCOMING" ||
    value === "COMPLETED" ||
    value === "NO_SHOW" ||
    value === "CANCELLED"
  );
}

export async function updateAppointmentStatus(
  appointmentId: string,
  nextStatus: string,
): Promise<UpdateAppointmentStatusResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Not authenticated." };
  }

  if (!appointmentId) {
    return { error: "Appointment id is required." };
  }

  if (!isValidAppointmentStatus(nextStatus)) {
    return { error: "Invalid appointment status." };
  }

  const existingAppointment = await db.appointment.findUnique({
    where: { id: appointmentId },
    select: { id: true },
  });

  if (!existingAppointment) {
    return { error: "Appointment not found." };
  }

  await db.appointment.update({
    where: { id: appointmentId },
    data: {
      status: nextStatus,
    },
  });

  revalidatePath("/schedule");

  return { success: true };
}
