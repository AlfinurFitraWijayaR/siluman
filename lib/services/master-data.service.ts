import { AcademicYearStatus } from "@/generated/prisma/enums";
import { prisma } from "../prisma";

export class MasterDataService {
  // ambil kelas usia yang aktif.
  static async getAgeGroups() {
    return prisma.ageGroup.findMany({
      select: {
        id: true,
        name: true,
        status: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }

  // ambil tahun akademik yang aktif
  static async getActiveAcademicYear(): Promise<string> {
    const active = await prisma.academic.findFirst({
      where: { isActive: AcademicYearStatus.AKTIF },
      orderBy: { createdAt: "desc" },
    });

    if (active) return active.name;

    const latest = await prisma.academic.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return latest?.name || "2025/2026";
  }
}
