import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database.....");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const dentistPassword = await bcrypt.hash("dentist123", 12);
  const receptionistPassword = await bcrypt.hash("reception123", 12);

  const adminUser = await db.user.upsert({
    where: { email: "admin@clinic.com" },
    update: {},
    create: {
      name: "Dr. Ahmed Hassan",
      email: "admin@clinic.com",
      passwordHash: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  const dentistUser = await db.user.upsert({
    where: { email: "dentist@clinic.com" },
    update: {},
    create: {
      name: "Dr. Sara Khalil",
      email: "dentist@clinic.com",
      passwordHash: dentistPassword,
      role: UserRole.DENTIST,
    },
  });

  const receptionistUser = await db.user.upsert({
    where: { email: "reception@clinic.com" },
    update: {},
    create: {
      name: "Nour Mahmoud",
      email: "reception@clinic.com",
      passwordHash: receptionistPassword,
      role: UserRole.RECEPTIONIST,
    },
  });

  await db.dentist.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      name: "Dr. Ahmed Hassan",
      color: "#2DD4BF", // teal color
      userId: adminUser.id,
    },
  });

  await db.dentist.upsert({
    where: { userId: dentistUser.id },
    update: {},
    create: {
      name: "Dr. Sara Khalil",
      color: "#818CF8",
      userId: dentistUser.id,
    },
  });

  console.log("Users created:");
  console.log(`   ADMIN       → ${adminUser.email} / admin123`);
  console.log(`   DENTIST     → ${dentistUser.email} / dentist123`);
  console.log(`   RECEPTIONIST → ${receptionistUser.email} / reception123`);
  console.log("Dentist profiles linked.");
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
