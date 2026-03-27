import {
  PrismaClient,
  UserRole,
  AvailabilityStatus,
  AppointmentStatus,
  TreatmentType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ─── Wipe everything in FK-safe order ────────────────────────
  await db.appointment.deleteMany();
  await db.patient.deleteMany();
  await db.dentist.deleteMany();
  await db.user.deleteMany();

  console.log("Database cleared.");

  // ─── Users ───────────────────────────────────────────────────
  const [adminHash, dentistHash, receptionHash] = await Promise.all([
    bcrypt.hash("admin123", 12),
    bcrypt.hash("dentist123", 12),
    bcrypt.hash("reception123", 12),
  ]);

  const adminUser = await db.user.create({
    data: {
      name: "Dr. Ahmed Hassan",
      email: "admin@clinic.com",
      passwordHash: adminHash,
      role: UserRole.ADMIN,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
    },
  });

  const dentistUser = await db.user.create({
    data: {
      name: "Dr. Sara Khalil",
      email: "dentist@clinic.com",
      passwordHash: dentistHash,
      role: UserRole.DENTIST,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
    },
  });

  const receptionistUser = await db.user.create({
    data: {
      name: "Nour Mahmoud",
      email: "reception@clinic.com",
      passwordHash: receptionHash,
      role: UserRole.RECEPTIONIST,
      availabilityStatus: AvailabilityStatus.AVAILABLE,
    },
  });

  console.log("Users created.");

  // ─── Dentist profiles ────────────────────────────────────────
  const ahmedDentist = await db.dentist.create({
    data: {
      name: "Dr. Ahmed Hassan",
      color: "#2DD4BF",
      userId: adminUser.id,
    },
  });

  const saraDentist = await db.dentist.create({
    data: {
      name: "Dr. Sara Khalil",
      color: "#818CF8",
      userId: dentistUser.id,
    },
  });

  console.log("Dentist profiles linked.");

  // ─── Patients ────────────────────────────────────────────────
  const [layla, karim, hana, youssef, nour, dina, omar, salma] =
    await Promise.all([
      db.patient.create({
        data: {
          fullName: "Layla Mostafa",
          phone: "01011112222",
          email: "layla@example.com",
          notes: "Allergic to penicillin.",
        },
      }),
      db.patient.create({
        data: {
          fullName: "Karim Adel",
          phone: "01022223333",
          email: "karim@example.com",
          notes: "Anxiety around dental procedures.",
        },
      }),
      db.patient.create({
        data: {
          fullName: "Hana Samir",
          phone: "01033334444",
          email: "hana@example.com",
        },
      }),
      db.patient.create({
        data: {
          fullName: "Youssef Fawzy",
          phone: "01044445555",
          email: "youssef@example.com",
        },
      }),
      db.patient.create({
        data: {
          fullName: "Nour El-Din",
          phone: "01055556666",
          email: "nour@example.com",
          notes: "Prefers morning appointments.",
        },
      }),
      db.patient.create({
        data: {
          fullName: "Dina Rashad",
          phone: "01066667777",
          email: "dina@example.com",
        },
      }),
      db.patient.create({
        data: {
          fullName: "Omar Tarek",
          phone: "01077778888",
          email: "omar@example.com",
        },
      }),
      db.patient.create({
        data: {
          fullName: "Salma Ibrahim",
          phone: "01088889999",
          email: "salma@example.com",
        },
      }),
    ]);

  console.log("Patients created.");

  // ─── Date helper ─────────────────────────────────────────────
  function makeDate(daysFromToday: number): Date {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // ─── Appointments (all times between 10:00–20:00) ────────────
  await db.appointment.createMany({
    data: [
      // ── 10 days ago ──
      {
        date: makeDate(-10),
        time: "10:00",
        status: AppointmentStatus.COMPLETED,
        treatmentType: TreatmentType.CLEANING,
        patientId: layla.id,
        dentistId: ahmedDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(-10),
        time: "13:00",
        status: AppointmentStatus.COMPLETED,
        treatmentType: TreatmentType.FILLING,
        patientId: karim.id,
        dentistId: saraDentist.id,
        createdById: receptionistUser.id,
      },

      // ── 7 days ago ──
      {
        date: makeDate(-7),
        time: "10:30",
        status: AppointmentStatus.COMPLETED,
        treatmentType: TreatmentType.CONSULTATION,
        patientId: hana.id,
        dentistId: ahmedDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(-7),
        time: "14:00",
        status: AppointmentStatus.NO_SHOW,
        treatmentType: TreatmentType.WHITENING,
        patientId: youssef.id,
        dentistId: saraDentist.id,
        createdById: receptionistUser.id,
      },

      // ── 5 days ago ──
      {
        date: makeDate(-5),
        time: "11:00",
        status: AppointmentStatus.COMPLETED,
        treatmentType: TreatmentType.EXTRACTION,
        patientId: nour.id,
        dentistId: ahmedDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(-5),
        time: "15:00",
        status: AppointmentStatus.CANCELLED,
        treatmentType: TreatmentType.CROWN,
        patientId: dina.id,
        dentistId: saraDentist.id,
        createdById: receptionistUser.id,
      },

      // ── 3 days ago ──
      {
        date: makeDate(-3),
        time: "10:00",
        status: AppointmentStatus.COMPLETED,
        treatmentType: TreatmentType.ROOT_CANAL,
        patientId: omar.id,
        dentistId: ahmedDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(-3),
        time: "12:30",
        status: AppointmentStatus.COMPLETED,
        treatmentType: TreatmentType.CHECKUP,
        patientId: salma.id,
        dentistId: saraDentist.id,
        createdById: receptionistUser.id,
      },

      // ── Yesterday ──
      {
        date: makeDate(-1),
        time: "10:00",
        status: AppointmentStatus.COMPLETED,
        treatmentType: TreatmentType.CLEANING,
        patientId: layla.id,
        dentistId: saraDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(-1),
        time: "16:00",
        status: AppointmentStatus.NO_SHOW,
        treatmentType: TreatmentType.FILLING,
        patientId: karim.id,
        dentistId: ahmedDentist.id,
        createdById: receptionistUser.id,
      },

      // ── Today ──
      {
        date: makeDate(0),
        time: "10:00",
        status: AppointmentStatus.COMPLETED,
        treatmentType: TreatmentType.CHECKUP,
        patientId: hana.id,
        dentistId: ahmedDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(0),
        time: "12:00",
        status: AppointmentStatus.COMPLETED,
        treatmentType: TreatmentType.ROOT_CANAL,
        patientId: nour.id,
        dentistId: ahmedDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(0),
        time: "15:00",
        status: AppointmentStatus.UPCOMING,
        treatmentType: TreatmentType.CROWN,
        patientId: youssef.id,
        dentistId: ahmedDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(0),
        time: "10:30",
        status: AppointmentStatus.COMPLETED,
        treatmentType: TreatmentType.WHITENING,
        patientId: dina.id,
        dentistId: saraDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(0),
        time: "13:00",
        status: AppointmentStatus.UPCOMING,
        treatmentType: TreatmentType.CLEANING,
        patientId: omar.id,
        dentistId: saraDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(0),
        time: "17:00",
        status: AppointmentStatus.UPCOMING,
        treatmentType: TreatmentType.CONSULTATION,
        patientId: salma.id,
        dentistId: saraDentist.id,
        createdById: receptionistUser.id,
      },

      // ── Tomorrow ──
      {
        date: makeDate(1),
        time: "10:00",
        status: AppointmentStatus.UPCOMING,
        treatmentType: TreatmentType.FILLING,
        patientId: layla.id,
        dentistId: ahmedDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(1),
        time: "14:00",
        status: AppointmentStatus.UPCOMING,
        treatmentType: TreatmentType.EXTRACTION,
        patientId: karim.id,
        dentistId: saraDentist.id,
        createdById: receptionistUser.id,
      },

      // ── 2 days ahead ──
      {
        date: makeDate(2),
        time: "11:00",
        status: AppointmentStatus.UPCOMING,
        treatmentType: TreatmentType.CROWN,
        patientId: hana.id,
        dentistId: ahmedDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(2),
        time: "13:30",
        status: AppointmentStatus.UPCOMING,
        treatmentType: TreatmentType.CHECKUP,
        patientId: nour.id,
        dentistId: saraDentist.id,
        createdById: receptionistUser.id,
      },

      // ── 3 days ahead ──
      {
        date: makeDate(3),
        time: "10:00",
        status: AppointmentStatus.UPCOMING,
        treatmentType: TreatmentType.CLEANING,
        patientId: youssef.id,
        dentistId: ahmedDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(3),
        time: "16:00",
        status: AppointmentStatus.UPCOMING,
        treatmentType: TreatmentType.CONSULTATION,
        patientId: dina.id,
        dentistId: saraDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(4),
        time: "11:30",
        status: AppointmentStatus.UPCOMING,
        treatmentType: TreatmentType.ROOT_CANAL,
        patientId: omar.id,
        dentistId: ahmedDentist.id,
        createdById: receptionistUser.id,
      },
      {
        date: makeDate(4),
        time: "14:00",
        status: AppointmentStatus.UPCOMING,
        treatmentType: TreatmentType.WHITENING,
        patientId: salma.id,
        dentistId: saraDentist.id,
        createdById: receptionistUser.id,
      },
    ],
  });

  console.log("Appointments created.");
  console.log("");
  console.log("─────────────────────────────────────");
  console.log("  ADMIN        → admin@clinic.com / admin123");
  console.log("  DENTIST      → dentist@clinic.com / dentist123");
  console.log("  RECEPTIONIST → reception@clinic.com / reception123");
  console.log("─────────────────────────────────────");
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
