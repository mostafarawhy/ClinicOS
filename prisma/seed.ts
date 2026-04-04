import {
  PrismaClient,
  UserRole,
  AvailabilityStatus,
  AppointmentStatus,
  TreatmentType,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

// Always stores as UTC midnight so @db.Date is timezone-safe
function makeDate(daysFromToday: number): Date {
  const now = new Date();
  return new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + daysFromToday,
    ),
  );
}

const APPOINTMENT_TIMES = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "13:00",
  "13:30",
  "14:00",
  "15:00",
  "15:30",
  "16:00",
  "17:00",
];

const TREATMENTS = [
  TreatmentType.CHECKUP,
  TreatmentType.CLEANING,
  TreatmentType.FILLING,
  TreatmentType.EXTRACTION,
  TreatmentType.ROOT_CANAL,
  TreatmentType.CROWN,
  TreatmentType.WHITENING,
  TreatmentType.ORTHODONTICS,
  TreatmentType.IMPLANT,
  TreatmentType.CONSULTATION,
  TreatmentType.OTHER,
];

type SeedPatient = { id: string };
type SeedDentist = { id: string };
type SeedUser = { id: string };

function isWeekend(date: Date) {
  const day = date.getUTCDay();
  return day === 5 || day === 6; // Friday + Saturday
}

function pickFromArray<T>(arr: T[], index: number): T {
  return arr[index % arr.length];
}

function getPastStatus(index: number): AppointmentStatus {
  // Bias toward COMPLETED, with some NO_SHOW and CANCELLED
  if (index % 9 === 0) return AppointmentStatus.CANCELLED;
  if (index % 5 === 0) return AppointmentStatus.NO_SHOW;
  return AppointmentStatus.COMPLETED;
}

function getAppointmentsPerDay(daysFromToday: number): number {
  // lighter distribution, but enough data for dashboard realism
  if (daysFromToday === 0) return 6;
  if (Math.abs(daysFromToday) % 7 === 0) return 2;
  if (Math.abs(daysFromToday) % 5 === 0) return 4;
  if (Math.abs(daysFromToday) % 3 === 0) return 3;
  return 2;
}

function buildAppointments(params: {
  patients: SeedPatient[];
  dentists: SeedDentist[];
  receptionists: SeedUser[];
}) {
  const { patients, dentists, receptionists } = params;

  const appointments: {
    date: Date;
    time: string;
    status: AppointmentStatus;
    treatmentType: TreatmentType;
    notes?: string;
    patientId: string;
    dentistId: string;
    createdById: string;
  }[] = [];

  let globalIndex = 0;

  // ~5 months back to ~5 months forward
  for (let dayOffset = -150; dayOffset <= 150; dayOffset++) {
    const date = makeDate(dayOffset);

    if (isWeekend(date)) continue;

    const appointmentsCount = getAppointmentsPerDay(dayOffset);

    for (let slot = 0; slot < appointmentsCount; slot++) {
      const patient = pickFromArray(patients, globalIndex + slot);
      const dentist = pickFromArray(dentists, globalIndex + dayOffset + slot + 1000);
      const receptionist = pickFromArray(
        receptionists,
        globalIndex + slot + dayOffset + 2000,
      );
      const treatment = pickFromArray(TREATMENTS, globalIndex + slot * 2);
      const time = pickFromArray(APPOINTMENT_TIMES, slot + (Math.abs(dayOffset) % 4));

      let status: AppointmentStatus;

      if (dayOffset < 0) {
        status = getPastStatus(globalIndex + slot);
      } else if (dayOffset === 0) {
        // Today: early slots completed, later slots upcoming
        status =
          slot < Math.ceil(appointmentsCount / 2)
            ? AppointmentStatus.COMPLETED
            : AppointmentStatus.UPCOMING;
      } else {
        status = AppointmentStatus.UPCOMING;
      }

      appointments.push({
        date,
        time,
        status,
        treatmentType: treatment,
        notes:
          status === AppointmentStatus.CANCELLED
            ? "Cancelled by patient."
            : status === AppointmentStatus.NO_SHOW
              ? "Patient did not attend."
              : undefined,
        patientId: patient.id,
        dentistId: dentist.id,
        createdById: receptionist.id,
      });
    }

    globalIndex += appointmentsCount;
  }

  return appointments;
}

async function main() {
  console.log("Seeding database...\n");

  // ── Wipe in FK-safe order ──────────────────────────────────────────────────
  await db.appointment.deleteMany();
  await db.patient.deleteMany();
  await db.dentist.deleteMany();
  await db.user.deleteMany();
  console.log("✓  Database cleared.");

  // ── Hash passwords ─────────────────────────────────────────────────────────
  const [adminHash, d1Hash, d2Hash, r1Hash, r2Hash] = await Promise.all([
    bcrypt.hash("admin123", 12),
    bcrypt.hash("dentist123", 12),
    bcrypt.hash("dentist456", 12),
    bcrypt.hash("reception123", 12),
    bcrypt.hash("reception456", 12),
  ]);

  // ── Users ──────────────────────────────────────────────────────────────────
  const [userAhmed, userSara, userOmar, userNour, userHana] = await Promise.all([
    db.user.create({
      data: {
        name: "Dr. Ahmed Samy",
        email: "admin@clinic.com",
        passwordHash: adminHash,
        role: UserRole.ADMIN,
        availabilityStatus: AvailabilityStatus.AVAILABLE,
      },
    }),
    db.user.create({
      data: {
        name: "Dr. Sara Khalil",
        email: "dentist1@clinic.com",
        passwordHash: d1Hash,
        role: UserRole.DENTIST,
        availabilityStatus: AvailabilityStatus.AVAILABLE,
      },
    }),
    db.user.create({
      data: {
        name: "Dr. Omar Nasser",
        email: "dentist2@clinic.com",
        passwordHash: d2Hash,
        role: UserRole.DENTIST,
        availabilityStatus: AvailabilityStatus.AVAILABLE,
      },
    }),
    db.user.create({
      data: {
        name: "Nour Mahmoud",
        email: "reception1@clinic.com",
        passwordHash: r1Hash,
        role: UserRole.RECEPTIONIST,
        availabilityStatus: AvailabilityStatus.AVAILABLE,
      },
    }),
    db.user.create({
      data: {
        name: "Hana Adel",
        email: "reception2@clinic.com",
        passwordHash: r2Hash,
        role: UserRole.RECEPTIONIST,
        availabilityStatus: AvailabilityStatus.AVAILABLE,
      },
    }),
  ]);
  console.log("✓  Users created.");

  // ── Dentist profiles ───────────────────────────────────────────────────────
  const [dAhmed, dSara, dOmar] = await Promise.all([
    db.dentist.create({
      data: { name: "Dr. Ahmed Samy", color: "#2DD4BF", userId: userAhmed.id },
    }),
    db.dentist.create({
      data: { name: "Dr. Sara Khalil", color: "#818CF8", userId: userSara.id },
    }),
    db.dentist.create({
      data: { name: "Dr. Omar Nasser", color: "#FB923C", userId: userOmar.id },
    }),
  ]);
  console.log("✓  Dentist profiles linked.");

  // ── Patients ───────────────────────────────────────────────────────────────
  const patients = await Promise.all([
    db.patient.create({
      data: {
        fullName: "Layla Mostafa",
        phone: "01011112222",
        email: "layla.mostafa@gmail.com",
        notes: "Allergic to penicillin. Requires antibiotic-free procedures.",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Karim Adel",
        phone: "01022223333",
        email: "karim.adel@outlook.com",
        notes: "Dental anxiety. Prefers short sessions with frequent breaks.",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Hana Samir",
        phone: "01033334444",
        email: "hana.samir@gmail.com",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Youssef Fawzy",
        phone: "01044445555",
        email: "youssef.fawzy@yahoo.com",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Nour El-Din",
        phone: "01055556666",
        email: "nour.eldin@gmail.com",
        notes: "Prefers morning appointments only.",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Dina Rashad",
        phone: "01066667777",
        email: "dina.rashad@hotmail.com",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Omar Tarek",
        phone: "01077778888",
        email: "omar.tarek@gmail.com",
        notes: "Diabetic. Monitor blood sugar before any invasive procedure.",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Salma Ibrahim",
        phone: "01088889999",
        email: "salma.ibrahim@gmail.com",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Ahmed Farouk",
        phone: "01099990000",
        email: "ahmed.farouk@outlook.com",
        notes: "Hypertensive. Avoid epinephrine-based local anesthesia.",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Mona Hassan",
        phone: "01111112222",
        email: "mona.hassan@gmail.com",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Tarek Gamal",
        phone: "01122223333",
        email: "tarek.gamal@yahoo.com",
        notes: "Requires full X-ray review before any restorative work.",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Rania Khaled",
        phone: "01133334444",
        email: "rania.khaled@gmail.com",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Samy Nabil",
        phone: "01144445555",
        email: "samy.nabil@hotmail.com",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Yasmine Mostafa",
        phone: "01155556666",
        email: "yasmine.mostafa@gmail.com",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Hassan Saeed",
        phone: "01166667777",
        email: "hassan.saeed@outlook.com",
        notes: "Latex allergy. Use latex-free gloves and materials only.",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Farah Ashraf",
        phone: "01211112222",
        email: "farah.ashraf@gmail.com",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Mahmoud Emad",
        phone: "01222223333",
        email: "mahmoud.emad@gmail.com",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Reem Tamer",
        phone: "01233334444",
        email: "reem.tamer@gmail.com",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Mostafa Wael",
        phone: "01244445555",
        email: "mostafa.wael@gmail.com",
      },
    }),
    db.patient.create({
      data: {
        fullName: "Nada Hossam",
        phone: "01255556666",
        email: "nada.hossam@gmail.com",
      },
    }),
  ]);
  console.log("✓  Patients created.");

  // ── Appointments ───────────────────────────────────────────────────────────
  const appointmentData = buildAppointments({
    patients,
    dentists: [dAhmed, dSara, dOmar],
    receptionists: [userNour, userHana],
  });

  // createMany can fail if batch is too large on some setups, so chunk it
  const chunkSize = 200;
  for (let i = 0; i < appointmentData.length; i += chunkSize) {
    await db.appointment.createMany({
      data: appointmentData.slice(i, i + chunkSize),
    });
  }

  console.log(`✓  Appointments created. (${appointmentData.length})`);

  const pastCount = appointmentData.filter(
    (a) => a.date.getTime() < makeDate(0).getTime(),
  ).length;
  const todayCount = appointmentData.filter(
    (a) => a.date.getTime() === makeDate(0).getTime(),
  ).length;
  const futureCount = appointmentData.filter(
    (a) => a.date.getTime() > makeDate(0).getTime(),
  ).length;

  console.log(`
────────────────────────────────────────────────────────────
  SEED COMPLETE
────────────────────────────────────────────────────────────
  ACCOUNTS
  ├─ Admin       admin@clinic.com        password: admin123
  ├─ Dentist 1   dentist1@clinic.com     password: dentist123
  ├─ Dentist 2   dentist2@clinic.com     password: dentist456
  ├─ Reception   reception1@clinic.com   password: reception123
  └─ Reception   reception2@clinic.com   password: reception456

  COUNTS
  ├─ Users             5
  ├─ Dentist profiles  3
  ├─ Patients          ${patients.length}
  └─ Appointments      ${appointmentData.length}
       ├─ Past ~5 months     ${pastCount}
       ├─ Today              ${todayCount}
       └─ Future ~5 months   ${futureCount}
────────────────────────────────────────────────────────────
`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });