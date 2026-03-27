import type {
  User,
  Dentist,
  Patient,
  Appointment,
  UserRole,
  AppointmentStatus,
  TreatmentType,
} from "@prisma/client";

export type { UserRole, AppointmentStatus, TreatmentType };

export type AppointmentWithRelations = Appointment & {
  patient: Pick<Patient, "id" | "fullName" | "phone">;
  dentist: Pick<Dentist, "id" | "name" | "color">;
  createdBy: Pick<User, "id" | "name">;
};

// Patient with appointment history
export type PatientWithAppointments = Patient & {
  appointments: AppointmentWithRelations[];
};

// Dentist with their appointments
export type DentistWithAppointments = Dentist & {
  appointments: AppointmentWithRelations[];
};

// Session user shape
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

// Form data types

export type AppointmentFormData = {
  patientId: string;
  dentistId: string;
  date: string;
  time: string;
  treatmentType: TreatmentType;
  status: AppointmentStatus;
  notes?: string;
};

export type PatientFormData = {
  fullName: string;
  phone: string;
  email?: string;
  notes?: string;
};
