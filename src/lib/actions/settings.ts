"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { UserRole } from "@prisma/client";

export type SettingsActionState = {
  success?: boolean;
  error?: string;
};

function getTrimmedString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isValidUserRole(value: string): value is UserRole {
  return value === "ADMIN" || value === "RECEPTIONIST";
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
  const email = getTrimmedString(formData, "email");
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

  await db.user.create({
    data: {
      name,
      email,

      role: roleValue,
      passwordHash,
    },
  });

  revalidatePath("/settings");

  return { success: true };
}
