import { AcademicYearStatus } from "@/generated/prisma/enums";
import { prisma } from "../prisma";

export interface AcademicYearListItemDTO {
  id: number;
  name: string;
  periodeStart: string;
  periodeEnd: string;
  isActive: AcademicYearStatus;
  trainingSessionCount: number;
  reportCardCount: number;
  createdAt: string;
}

export interface CreateAcademicYearPayload {
  name: string;
  periodeStart: string;
  periodeEnd: string;
  isActive?: AcademicYearStatus;
}

export interface UpdateAcademicYearPayload {
  name: string;
  periodeStart: string;
  periodeEnd: string;
  isActive?: AcademicYearStatus;
}

export class AcademicYearService {
  // get all
  static async getAcademicYears(): Promise<AcademicYearListItemDTO[]> {
    const raw = await prisma.academic.findMany({
      include: {
        _count: { select: { trainingSessions: true, reportCards: true } },
      },
      orderBy: { name: "asc" },
    });

    return raw.map((a) => ({
      id: a.id,
      name: a.name,
      periodeStart: a.periodeStart.toISOString().split("T")[0],
      periodeEnd: a.periodeEnd.toISOString().split("T")[0],
      isActive: a.isActive,
      trainingSessionCount: a._count.trainingSessions,
      reportCardCount: a._count.reportCards,
      createdAt: a.createdAt.toISOString(),
    }));
  }

  // get by id
  static async getAcademicById(
    id: number,
  ): Promise<AcademicYearListItemDTO | null> {
    const a = await prisma.academic.findUnique({
      where: { id },
      include: {
        _count: { select: { trainingSessions: true, reportCards: true } },
      },
    });
    if (!a) return null;
    return {
      id: a.id,
      name: a.name,
      periodeStart: a.periodeStart.toISOString().split("T")[0],
      periodeEnd: a.periodeEnd.toISOString().split("T")[0],
      isActive: a.isActive,
      trainingSessionCount: a._count.trainingSessions,
      reportCardCount: a._count.reportCards,
      createdAt: a.createdAt.toISOString(),
    };
  }

  // create
  static async createAcademicYear(data: CreateAcademicYearPayload) {
    const trimmedName = data.name.trim();
    const existing = await prisma.academic.findFirst({
      where: { name: trimmedName },
    });
    if (existing) {
      throw new Error(`Tahun akademik ${trimmedName} sudah ada.`);
    }

    return prisma.academic.create({
      data: {
        name: trimmedName,
        periodeStart: new Date(data.periodeStart),
        periodeEnd: new Date(data.periodeEnd),
        isActive: data.isActive || AcademicYearStatus.NONAKTIF,
      },
    });
  }

  // update
  static async updateAcademicYear(id: number, data: UpdateAcademicYearPayload) {
    const a = await prisma.academic.findUnique({ where: { id } });
    if (!a) {
      throw new Error("Tahun akademik tidak ditemukan.");
    }
    const trimmedName = data.name.trim();
    if (trimmedName.toLowerCase() !== a.name.toLowerCase()) {
      const conflict = await prisma.academic.findFirst({
        where: { name: trimmedName },
      });
      if (conflict && conflict.id !== id) {
        throw new Error(`Tahun akademik ${trimmedName} sudah ada.`);
      }
    }
    return prisma.academic.update({
      where: { id },
      data: {
        name: trimmedName,
        periodeStart: new Date(data.periodeStart),
        periodeEnd: new Date(data.periodeEnd),
        isActive: data.isActive || AcademicYearStatus.NONAKTIF,
      },
    });
  }

  // delete
  static async deleteAcademicYear(id: number) {
    const a = await prisma.academic.findUnique({
      where: { id },
      include: {
        _count: { select: { trainingSessions: true, reportCards: true } },
      },
    });
    if (!a) {
      throw new Error("Tahun akademik tidak ditemukan.");
    }
    if (a._count.trainingSessions > 0) {
      throw new Error(
        `Tidak dapat menghapus tahun akademik ${a.name} karena masih memiliki ${a._count.trainingSessions} sesi latihan.`,
      );
    }
    if (a._count.reportCards > 0) {
      throw new Error(
        `Tidak dapat menghapus tahun akademik ${a.name} karena memiliki ${a._count.reportCards} raport.`,
      );
    }
    return prisma.academic.delete({ where: { id } });
  }
}
