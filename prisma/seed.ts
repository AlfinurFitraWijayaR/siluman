import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import {
  Role,
  StudentStatus,
  DocumentStatus,
  Position,
  AgeGroupStatus,
} from "../generated/prisma/enums";

async function main() {
  console.log("Seeding initial data for SILUMAN...");

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

  // Master Kelas Usia
  const ageGroups = [
    {
      name: "U-10",
      status: AgeGroupStatus.AKTIF,
      notes: "Kelompok Usia 10 Tahun",
    },
    {
      name: "U-12",
      status: AgeGroupStatus.AKTIF,
      notes: "Kelompok Usia 12 Tahun",
    },
    {
      name: "U-14",
      status: AgeGroupStatus.AKTIF,
      notes: "Kelompok Usia 14 Tahun",
    },
    {
      name: "U-16",
      status: AgeGroupStatus.AKTIF,
      notes: "Kelompok Usia 16 Tahun",
    },
    {
      name: "U-17",
      status: AgeGroupStatus.AKTIF,
      notes: "Kelompok Usia 17 Tahun",
    },
  ];

  for (const ag of ageGroups) {
    await prisma.ageGroup.upsert({
      where: { name: ag.name },
      update: {},
      create: ag,
    });
  }

  // Master Tahun Akademik
  await prisma.academic.upsert({
    where: { id: 1 },
    update: { isActive: true },
    create: {
      id: 1,
      name: "2025/2026",
      periodeStart: new Date("2025-07-01"),
      periodeEnd: new Date("2026-06-30"),
      isActive: true,
    },
  });

  // Contoh Siswa Awal
  const u10 = await prisma.ageGroup.findUnique({ where: { name: "U-10" } });
  const u12 = await prisma.ageGroup.findUnique({ where: { name: "U-12" } });
  const u14 = await prisma.ageGroup.findUnique({ where: { name: "U-14" } });

  const dummyStudents = [
    {
      nis: "MDL16001",
      name: "Muhammad Rizky Pratama",
      placeOfBirth: "Majalengka",
      dateOfBirth: new Date("2016-04-10"),
      address: "Blok Cikadu RT 02 RW 01, Sukasari Kidul",
      joinDate: new Date("2024-01-10"),
      status: StudentStatus.AKTIF,
      parentName: "Ahmad Subagja",
      phone: "081321456789",
      position: Position.TENGAH,
      ageGroupId: u10?.id,
    },
    {
      nis: "MDL16002",
      name: "Dimas Arya Wijaya",
      placeOfBirth: "Majalengka",
      dateOfBirth: new Date("2016-08-15"),
      address: "Desa Tejamulya, Argapura",
      joinDate: new Date("2024-01-15"),
      status: StudentStatus.AKTIF,
      parentName: "Wijaya Kusuma",
      phone: "085223344556",
      position: Position.DEPAN,
      ageGroupId: u10?.id,
    },
    {
      nis: "MDL14001",
      name: "Fajar Maulana Sidik",
      placeOfBirth: "Cirebon",
      dateOfBirth: new Date("2014-02-20"),
      address: "Sukasari Kaler, Argapura",
      joinDate: new Date("2023-06-01"),
      status: StudentStatus.AKTIF,
      parentName: "Dedi Supardi",
      phone: "087712345678",
      position: Position.BELAKANG,
      ageGroupId: u12?.id,
    },
    {
      nis: "MDL12001",
      name: "Rangga Aditya",
      placeOfBirth: "Majalengka",
      dateOfBirth: new Date("2012-11-05"),
      address: "Desa Haurgeulis, Bantarujeg",
      joinDate: new Date("2022-08-10"),
      status: StudentStatus.AKTIF,
      parentName: "Nana Suryana",
      phone: "089612344321",
      position: Position.KIPER,
      ageGroupId: u14?.id,
    },
  ];

  for (const st of dummyStudents) {
    const student = await prisma.student.upsert({
      where: { nis: st.nis },
      update: {},
      create: st,
    });

    // Inisialisasi dokumen
    const doc = await prisma.studentDocument.findFirst({
      where: { nis: student.nis },
    });
    if (!doc) {
      await prisma.studentDocument.create({
        data: {
          nis: student.nis,
          status: DocumentStatus.TERVERIFIKASI,
          registrationForm: "form_terisi.pdf",
          familyCard: "kk.pdf",
          birthCertificate: "akta.pdf",
          pasPhoto: "foto.jpg",
          notes: "Berkas lengkap dan terverifikasi",
        },
      });
    }
  }

  console.log("Seed finished successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
