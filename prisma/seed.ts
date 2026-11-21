import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "../app/generated/prisma/enums";

async function main() {
  console.log("Seeding initial users for SILUMAN...");

  const adminPassword = await bcrypt.hash("admin123", 10);
  const pelatihPassword = await bcrypt.hash("pelatih123", 10);

  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@siluman.ssb",
      password: adminPassword,
      role: Role.ADMINISTRATOR,
      phone: "081234567890",
    },
  });

  const pelatihUser = await prisma.user.upsert({
    where: { username: "coach" },
    update: {},
    create: {
      username: "coach",
      email: "coach@siluman.ssb",
      password: pelatihPassword,
      role: Role.PELATIH,
      phone: "081298765432",
      coach: {
        create: {
          license: "Lisensi C PSSI",
          placeOfBirth: "Majalengka",
          dateOfBirth: new Date("1988-05-12"),
          address: "Desa Sukasari Kidul, Argapura",
        },
      },
    },
  });

  console.log("Seed finished successfully.");
  console.log({ adminUser: admin.username, pelatihUser: pelatihUser.username });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
