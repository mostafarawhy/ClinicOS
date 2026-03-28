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
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + daysFromToday),
  );
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
    bcrypt.hash("admin123",    12),
    bcrypt.hash("dentist123",  12),
    bcrypt.hash("dentist456",  12),
    bcrypt.hash("reception123",12),
    bcrypt.hash("reception456",12),
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
      data: { name: "Dr. Ahmed Samy",  color: "#2DD4BF", userId: userAhmed.id },
    }),
    db.dentist.create({
      data: { name: "Dr. Sara Khalil", color: "#818CF8", userId: userSara.id  },
    }),
    db.dentist.create({
      data: { name: "Dr. Omar Nasser", color: "#FB923C", userId: userOmar.id  },
    }),
  ]);
  console.log("✓  Dentist profiles linked.");

  // ── Patients ───────────────────────────────────────────────────────────────
  const [
    p01, p02, p03, p04, p05,
    p06, p07, p08, p09, p10,
    p11, p12, p13, p14, p15,
  ] = await Promise.all([
    db.patient.create({ data: { fullName: "Layla Mostafa",   phone: "01011112222", email: "layla.mostafa@gmail.com",   notes: "Allergic to penicillin. Requires antibiotic-free procedures."         } }),
    db.patient.create({ data: { fullName: "Karim Adel",      phone: "01022223333", email: "karim.adel@outlook.com",    notes: "Dental anxiety. Prefers short sessions with frequent breaks."          } }),
    db.patient.create({ data: { fullName: "Hana Samir",      phone: "01033334444", email: "hana.samir@gmail.com"                                                                                      } }),
    db.patient.create({ data: { fullName: "Youssef Fawzy",   phone: "01044445555", email: "youssef.fawzy@yahoo.com"                                                                                   } }),
    db.patient.create({ data: { fullName: "Nour El-Din",     phone: "01055556666", email: "nour.eldin@gmail.com",      notes: "Prefers morning appointments only."                                    } }),
    db.patient.create({ data: { fullName: "Dina Rashad",     phone: "01066667777", email: "dina.rashad@hotmail.com"                                                                                   } }),
    db.patient.create({ data: { fullName: "Omar Tarek",      phone: "01077778888", email: "omar.tarek@gmail.com",      notes: "Diabetic. Monitor blood sugar before any invasive procedure."         } }),
    db.patient.create({ data: { fullName: "Salma Ibrahim",   phone: "01088889999", email: "salma.ibrahim@gmail.com"                                                                                   } }),
    db.patient.create({ data: { fullName: "Ahmed Farouk",    phone: "01099990000", email: "ahmed.farouk@outlook.com",  notes: "Hypertensive. Avoid epinephrine-based local anesthesia."              } }),
    db.patient.create({ data: { fullName: "Mona Hassan",     phone: "01111112222", email: "mona.hassan@gmail.com"                                                                                     } }),
    db.patient.create({ data: { fullName: "Tarek Gamal",     phone: "01122223333", email: "tarek.gamal@yahoo.com",     notes: "Requires full X-ray review before any restorative work."              } }),
    db.patient.create({ data: { fullName: "Rania Khaled",    phone: "01133334444", email: "rania.khaled@gmail.com"                                                                                    } }),
    db.patient.create({ data: { fullName: "Samy Nabil",      phone: "01144445555", email: "samy.nabil@hotmail.com"                                                                                    } }),
    db.patient.create({ data: { fullName: "Yasmine Mostafa", phone: "01155556666", email: "yasmine.mostafa@gmail.com"                                                                                 } }),
    db.patient.create({ data: { fullName: "Hassan Saeed",    phone: "01166667777", email: "hassan.saeed@outlook.com",  notes: "Latex allergy. Use latex-free gloves and materials only."             } }),
  ]);
  console.log("✓  Patients created.");

  // ── Appointments ───────────────────────────────────────────────────────────
  const r1 = userNour.id;
  const r2 = userHana.id;

  await db.appointment.createMany({
    data: [

      // ════════════════════════════════════════════════════════════════════════
      // LAST MONTH  ·  ~20 appointments  ·  COMPLETED / NO_SHOW / CANCELLED
      // ════════════════════════════════════════════════════════════════════════

      // -40 days  (3 appts)
      { date: makeDate(-40), time: "10:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CLEANING,     patientId: p01.id, dentistId: dAhmed.id, createdById: r1 },
      { date: makeDate(-40), time: "13:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.FILLING,      patientId: p02.id, dentistId: dSara.id,  createdById: r2 },
      { date: makeDate(-40), time: "15:00", status: AppointmentStatus.NO_SHOW,    treatmentType: TreatmentType.CHECKUP,      patientId: p03.id, dentistId: dOmar.id,  createdById: r1 },

      // -37 days  (2 appts)
      { date: makeDate(-37), time: "10:30", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CONSULTATION, patientId: p04.id, dentistId: dAhmed.id, createdById: r2 },
      { date: makeDate(-37), time: "14:00", status: AppointmentStatus.CANCELLED,  treatmentType: TreatmentType.WHITENING,    patientId: p05.id, dentistId: dOmar.id,  createdById: r1 },

      // -34 days  (3 appts)
      { date: makeDate(-34), time: "11:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.EXTRACTION,   patientId: p06.id, dentistId: dSara.id,  createdById: r2 },
      { date: makeDate(-34), time: "12:00", status: AppointmentStatus.NO_SHOW,    treatmentType: TreatmentType.ORTHODONTICS, patientId: p08.id, dentistId: dAhmed.id, createdById: r1 },
      { date: makeDate(-34), time: "16:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CROWN,        patientId: p07.id, dentistId: dOmar.id,  createdById: r2 },

      // -31 days  (2 appts)
      { date: makeDate(-31), time: "10:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.ROOT_CANAL,   patientId: p09.id, dentistId: dAhmed.id, createdById: r1 },
      { date: makeDate(-31), time: "13:30", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.IMPLANT,      patientId: p10.id, dentistId: dSara.id,  createdById: r2 },

      // -28 days  (3 appts)
      { date: makeDate(-28), time: "11:30", status: AppointmentStatus.CANCELLED,  treatmentType: TreatmentType.CLEANING,     patientId: p11.id, dentistId: dOmar.id,  createdById: r1 },
      { date: makeDate(-28), time: "14:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.FILLING,      patientId: p12.id, dentistId: dAhmed.id, createdById: r2 },
      { date: makeDate(-28), time: "17:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.OTHER,        patientId: p13.id, dentistId: dSara.id,  createdById: r1 },

      // -24 days  (3 appts)
      { date: makeDate(-24), time: "10:00", status: AppointmentStatus.NO_SHOW,    treatmentType: TreatmentType.WHITENING,    patientId: p14.id, dentistId: dOmar.id,  createdById: r2 },
      { date: makeDate(-24), time: "12:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CHECKUP,      patientId: p01.id, dentistId: dSara.id,  createdById: r1 },
      { date: makeDate(-24), time: "15:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CONSULTATION, patientId: p15.id, dentistId: dAhmed.id, createdById: r2 },

      // -21 days  (2 appts)
      { date: makeDate(-21), time: "10:30", status: AppointmentStatus.CANCELLED,  treatmentType: TreatmentType.CROWN,        patientId: p02.id, dentistId: dOmar.id,  createdById: r1 },
      { date: makeDate(-21), time: "13:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.EXTRACTION,   patientId: p03.id, dentistId: dAhmed.id, createdById: r2 },

      // -18 days  (2 appts)
      { date: makeDate(-18), time: "11:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.ORTHODONTICS, patientId: p04.id, dentistId: dSara.id,  createdById: r1 },
      { date: makeDate(-18), time: "16:00", status: AppointmentStatus.NO_SHOW,    treatmentType: TreatmentType.IMPLANT,      patientId: p05.id, dentistId: dOmar.id,  createdById: r2 },

      // ════════════════════════════════════════════════════════════════════════
      // CURRENT MONTH UP TO TODAY  ·  ~20 appointments  ·  COMPLETED / NO_SHOW / CANCELLED
      // ════════════════════════════════════════════════════════════════════════

      // -15 days  (3 appts)
      { date: makeDate(-15), time: "10:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CLEANING,     patientId: p06.id, dentistId: dAhmed.id, createdById: r2 },
      { date: makeDate(-15), time: "14:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.ROOT_CANAL,   patientId: p07.id, dentistId: dSara.id,  createdById: r1 },
      { date: makeDate(-15), time: "17:00", status: AppointmentStatus.CANCELLED,  treatmentType: TreatmentType.FILLING,      patientId: p08.id, dentistId: dOmar.id,  createdById: r2 },

      // -12 days  (2 appts)
      { date: makeDate(-12), time: "11:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CHECKUP,      patientId: p09.id, dentistId: dAhmed.id, createdById: r1 },
      { date: makeDate(-12), time: "13:00", status: AppointmentStatus.NO_SHOW,    treatmentType: TreatmentType.WHITENING,    patientId: p10.id, dentistId: dOmar.id,  createdById: r2 },

      // -10 days  (3 appts)
      { date: makeDate(-10), time: "10:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CROWN,        patientId: p11.id, dentistId: dSara.id,  createdById: r1 },
      { date: makeDate(-10), time: "15:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CONSULTATION, patientId: p12.id, dentistId: dAhmed.id, createdById: r2 },
      { date: makeDate(-10), time: "18:00", status: AppointmentStatus.CANCELLED,  treatmentType: TreatmentType.EXTRACTION,   patientId: p13.id, dentistId: dOmar.id,  createdById: r1 },

      // -8 days  (2 appts)
      { date: makeDate(-8),  time: "10:30", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.IMPLANT,      patientId: p14.id, dentistId: dAhmed.id, createdById: r2 },
      { date: makeDate(-8),  time: "13:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.OTHER,        patientId: p15.id, dentistId: dSara.id,  createdById: r1 },

      // -6 days  (3 appts)
      { date: makeDate(-6),  time: "11:00", status: AppointmentStatus.NO_SHOW,    treatmentType: TreatmentType.CLEANING,     patientId: p01.id, dentistId: dOmar.id,  createdById: r2 },
      { date: makeDate(-6),  time: "14:30", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.FILLING,      patientId: p02.id, dentistId: dSara.id,  createdById: r1 },
      { date: makeDate(-6),  time: "16:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.ORTHODONTICS, patientId: p03.id, dentistId: dAhmed.id, createdById: r2 },

      // -4 days  (2 appts)
      { date: makeDate(-4),  time: "10:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CHECKUP,      patientId: p04.id, dentistId: dSara.id,  createdById: r1 },
      { date: makeDate(-4),  time: "15:00", status: AppointmentStatus.CANCELLED,  treatmentType: TreatmentType.ROOT_CANAL,   patientId: p05.id, dentistId: dOmar.id,  createdById: r2 },

      // -2 days  (2 appts)
      { date: makeDate(-2),  time: "10:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CROWN,        patientId: p06.id, dentistId: dAhmed.id, createdById: r1 },
      { date: makeDate(-2),  time: "13:30", status: AppointmentStatus.NO_SHOW,    treatmentType: TreatmentType.WHITENING,    patientId: p07.id, dentistId: dSara.id,  createdById: r2 },

      // -1 day  (2 appts)
      { date: makeDate(-1),  time: "11:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CONSULTATION, patientId: p08.id, dentistId: dOmar.id,  createdById: r1 },
      { date: makeDate(-1),  time: "14:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CLEANING,     patientId: p09.id, dentistId: dAhmed.id, createdById: r2 },

      // ════════════════════════════════════════════════════════════════════════
      // TODAY  ·  6 appointments  ·  COMPLETED + UPCOMING
      // ════════════════════════════════════════════════════════════════════════

      { date: makeDate(0),   time: "10:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.CHECKUP,      patientId: p10.id, dentistId: dAhmed.id, createdById: r1 },
      { date: makeDate(0),   time: "11:30", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.FILLING,      patientId: p11.id, dentistId: dSara.id,  createdById: r2 },
      { date: makeDate(0),   time: "12:00", status: AppointmentStatus.COMPLETED,  treatmentType: TreatmentType.EXTRACTION,   patientId: p12.id, dentistId: dOmar.id,  createdById: r1 },
      { date: makeDate(0),   time: "15:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.ROOT_CANAL,   patientId: p13.id, dentistId: dAhmed.id, createdById: r2 },
      { date: makeDate(0),   time: "17:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.CROWN,        patientId: p14.id, dentistId: dSara.id,  createdById: r1 },
      { date: makeDate(0),   time: "19:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.CONSULTATION, patientId: p15.id, dentistId: dOmar.id,  createdById: r2 },

      // ════════════════════════════════════════════════════════════════════════
      // NEXT 2 WEEKS  ·  15 appointments  ·  all UPCOMING
      // ════════════════════════════════════════════════════════════════════════

      // +1 day  (3 appts)
      { date: makeDate(1),   time: "10:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.CLEANING,     patientId: p01.id, dentistId: dAhmed.id, createdById: r1 },
      { date: makeDate(1),   time: "13:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.WHITENING,    patientId: p02.id, dentistId: dSara.id,  createdById: r2 },
      { date: makeDate(1),   time: "15:30", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.IMPLANT,      patientId: p03.id, dentistId: dOmar.id,  createdById: r1 },

      // +3 days  (2 appts)
      { date: makeDate(3),   time: "10:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.FILLING,      patientId: p04.id, dentistId: dAhmed.id, createdById: r2 },
      { date: makeDate(3),   time: "14:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.ORTHODONTICS, patientId: p05.id, dentistId: dSara.id,  createdById: r1 },

      // +5 days  (3 appts)
      { date: makeDate(5),   time: "11:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.CHECKUP,      patientId: p06.id, dentistId: dOmar.id,  createdById: r2 },
      { date: makeDate(5),   time: "13:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.CONSULTATION, patientId: p07.id, dentistId: dAhmed.id, createdById: r1 },
      { date: makeDate(5),   time: "16:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.CLEANING,     patientId: p08.id, dentistId: dSara.id,  createdById: r2 },

      // +7 days  (2 appts)
      { date: makeDate(7),   time: "10:30", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.CROWN,        patientId: p09.id, dentistId: dOmar.id,  createdById: r1 },
      { date: makeDate(7),   time: "14:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.EXTRACTION,   patientId: p10.id, dentistId: dAhmed.id, createdById: r2 },

      // +9 days  (2 appts)
      { date: makeDate(9),   time: "11:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.ROOT_CANAL,   patientId: p11.id, dentistId: dSara.id,  createdById: r1 },
      { date: makeDate(9),   time: "15:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.WHITENING,    patientId: p12.id, dentistId: dOmar.id,  createdById: r2 },

      // +11 days  (2 appts)
      { date: makeDate(11),  time: "10:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.IMPLANT,      patientId: p13.id, dentistId: dAhmed.id, createdById: r1 },
      { date: makeDate(11),  time: "13:30", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.OTHER,        patientId: p14.id, dentistId: dSara.id,  createdById: r2 },

      // +14 days  (1 appt)
      { date: makeDate(14),  time: "12:00", status: AppointmentStatus.UPCOMING,   treatmentType: TreatmentType.FILLING,      patientId: p15.id, dentistId: dOmar.id,  createdById: r1 },
    ],
  });

  console.log("✓  Appointments created.");

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
  ├─ Users           5  (1 admin, 2 dentists, 2 receptionists)
  ├─ Dentist profiles  3
  ├─ Patients       15
  └─ Appointments   61
       ├─ Last month        20  (COMPLETED / NO_SHOW / CANCELLED)
       ├─ Current month     20  (COMPLETED / NO_SHOW / CANCELLED)
       ├─ Today              6  (3 COMPLETED + 3 UPCOMING)
       └─ Next 2 weeks      15  (all UPCOMING)
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
