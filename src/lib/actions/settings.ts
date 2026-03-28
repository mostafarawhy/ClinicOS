"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { AvailabilityStatus, UserRole } from "@prisma/client";

export type SettingsActionState = {
  success?: boolean;
  error?: string;
};

function getTrimmedString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidUserRole(value: string): value is UserRole {
  return value === "ADMIN" || value === "RECEPTIONIST" || value === "DENTIST";
}

function isValidAvailabilityStatus(value: string): value is AvailabilityStatus {
  return (
    value === "AVAILABLE" ||
    value === "BUSY" ||
    value === "SICK_LEAVE" ||
    value === "VACATION" ||
    value === "REMOTE" ||
    value === "DAY_OFF"
  );
}

export async function changePassword(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Not authenticated." };
  }

  const currentPassword = getTrimmedString(formData, "current");
  const newPassword = getTrimmedString(formData, "password");
  const confirmPassword = getTrimmedString(formData, "confirmPassword");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All password fields are required." };
  }

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return { error: "User not found." };
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.passwordHash,
  );

  if (!isCurrentPasswordValid) {
    return { error: "Current password is incorrect." };
  }

  const newPasswordHash = await bcrypt.hash(newPassword, 12);

  await db.user.update({
    where: { id: session.user.id },
    data: {
      passwordHash: newPasswordHash,
    },
  });

  revalidatePath("/settings");

  return { success: true };
}

export async function createUser(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { error: "Unauthorized." };
  }

  const name = getTrimmedString(formData, "name");
  const email = getTrimmedString(formData, "email").toLowerCase();
  const roleValue = getTrimmedString(formData, "role");
  const password = getTrimmedString(formData, "password");
  const confirmPassword = getTrimmedString(formData, "confirmPassword");

  if (!name || !email || !roleValue || !password || !confirmPassword) {
    return { error: "All fields are required." };
  }

  if (!isValidUserRole(roleValue)) {
    return { error: "Invalid role selected." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: "A user with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          role: roleValue as UserRole,
          passwordHash,
          isActive: true,
        },
      });

      const shouldCreateDentistProfile =
        roleValue === "ADMIN" || roleValue === "DENTIST";

      if (shouldCreateDentistProfile) {
        await tx.dentist.create({
          data: {
            name,
            color: "#6366F1",
            userId: user.id,
          },
        });
      }
    });

    revalidatePath("/settings");
    revalidatePath("/appointments");
    revalidatePath("/schedule");
    revalidatePath("/calendar");

    return { success: true };
  } catch (error) {
    console.error("Create user failed:", error);
    return { error: "Unable to create user right now." };
  }
}

export async function updateAvailabilityStatus(
  _prevState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Not authenticated." };
  }

  const statusValue = getTrimmedString(formData, "availabilityStatus");

  if (!isValidAvailabilityStatus(statusValue)) {
    return { error: "Invalid availability status." };
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, isActive: true },
  });

  if (!user) {
    return { error: "User not found." };
  }

  if (!user.isActive) {
    return { error: "Inactive users cannot update their status." };
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      availabilityStatus: statusValue,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/schedule");

  return { success: true };
}

type ToggleUserAccessActionState = {
  error?: string;
  success?: boolean;
};

async function verifyAdminPassword(
  adminId: string,
  password: string,
): Promise<boolean> {
  const admin = await db.user.findUnique({
    where: { id: adminId },
    select: { passwordHash: true },
  });

  if (!admin) return false;

  return bcrypt.compare(password, admin.passwordHash);
}

export async function deactivateUser(
  _prev: ToggleUserAccessActionState,
  formData: FormData,
): Promise<ToggleUserAccessActionState> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Unauthorized." };
  }

  const targetId = getTrimmedString(formData, "targetId");
  const password = getTrimmedString(formData, "password");

  if (!targetId || !password) {
    return { error: "All fields are required." };
  }

  if (targetId === session.user.id) {
    return { error: "You cannot deactivate your own account." };
  }

  const passwordValid = await verifyAdminPassword(session.user.id, password);

  if (!passwordValid) {
    return { error: "Incorrect password." };
  }

  const targetUser = await db.user.findUnique({
    where: { id: targetId },
    select: { id: true, isActive: true },
  });

  if (!targetUser) {
    return { error: "User not found." };
  }

  if (!targetUser.isActive) {
    return { error: "User is already inactive." };
  }

  try {
    await db.user.update({
      where: { id: targetId },
      data: { isActive: false },
    });

    revalidatePath("/settings");
    revalidatePath("/schedule");
    revalidatePath("/appointments");
    revalidatePath("/calendar");

    return { success: true };
  } catch (error) {
    console.error("Deactivate user failed:", error);
    return { error: "Unable to deactivate this user right now." };
  }
}

export async function reactivateUser(
  _prev: ToggleUserAccessActionState,
  formData: FormData,
): Promise<ToggleUserAccessActionState> {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return { error: "Unauthorized." };
  }

  const targetId = getTrimmedString(formData, "targetId");
  const password = getTrimmedString(formData, "password");

  if (!targetId || !password) {
    return { error: "All fields are required." };
  }

  const passwordValid = await verifyAdminPassword(session.user.id, password);

  if (!passwordValid) {
    return { error: "Incorrect password." };
  }

  const targetUser = await db.user.findUnique({
    where: { id: targetId },
    select: { id: true, isActive: true },
  });

  if (!targetUser) {
    return { error: "User not found." };
  }

  if (targetUser.isActive) {
    return { error: "User is already active." };
  }

  try {
    await db.user.update({
      where: { id: targetId },
      data: { isActive: true },
    });

    revalidatePath("/settings");
    revalidatePath("/schedule");
    revalidatePath("/appointments");
    revalidatePath("/calendar");

    return { success: true };
  } catch (error) {
    console.error("Reactivate user failed:", error);
    return { error: "Unable to reactivate this user right now." };
  }
}
