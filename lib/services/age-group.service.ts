import { prisma } from "../prisma";
import { AgeGroupStatus } from "../../generated/prisma/enums";

export interface AgeGroupListItemDTO {
  id: number;
  name: string;
  status: AgeGroupStatus;
  notes: string | null;
  studentCount: number;
  trainingSessionCount: number;
  reportCardCount: number;
  createdAt: string;
}

export interface CreateAgeGroupPayload {
  name: string;
  status?: AgeGroupStatus;
  notes?: string | null;
}

export interface UpdateAgeGroupPayload {
  name: string;
  status?: AgeGroupStatus;
  notes?: string | null;
}

export class AgeGroupService {
  // get all
  static async getAgeGroups(): Promise<AgeGroupListItemDTO[]> {
    const rawGroups = await prisma.ageGroup.findMany({
      include: {
        _count: {
          select: {
            students: true,
            trainingSessions: true,
            reportCards: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return rawGroups.map((ag) => ({
      id: ag.id,
      name: ag.name,
      status: ag.status,
      notes: ag.notes,
      studentCount: ag._count.students,
      trainingSessionCount: ag._count.trainingSessions,
      reportCardCount: ag._count.reportCards,
      createdAt: ag.createdAt.toISOString(),
    }));
  }

  // get by ID
  static async getAgeGroupById(
    id: number,
  ): Promise<AgeGroupListItemDTO | null> {
    const ag = await prisma.ageGroup.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            trainingSessions: true,
            reportCards: true,
          },
        },
      },
    });

    if (!ag) return null;

    return {
      id: ag.id,
      name: ag.name,
      status: ag.status,
      notes: ag.notes,
      studentCount: ag._count.students,
      trainingSessionCount: ag._count.trainingSessions,
      reportCardCount: ag._count.reportCards,
      createdAt: ag.createdAt.toISOString(),
    };
  }

  // create
  static async createAgeGroup(data: CreateAgeGroupPayload) {
    const trimmedName = data.name.trim();

    const existing = await prisma.ageGroup.findUnique({
      where: { name: trimmedName },
    });
    if (existing) {
      throw new Error(`Kelas usia ${trimmedName} sudah terdaftar.`);
    }

    return prisma.ageGroup.create({
      data: {
        name: trimmedName,
        status: data.status || AgeGroupStatus.AKTIF,
        notes: data.notes?.trim() || null,
      },
    });
  }

  // update
  static async updateAgeGroup(id: number, data: UpdateAgeGroupPayload) {
    const ag = await prisma.ageGroup.findUnique({
      where: { id },
    });
    if (!ag) {
      throw new Error("Kelas usia tidak ditemukan.");
    }

    const trimmedName = data.name.trim();

    if (trimmedName.toLowerCase() !== ag.name.toLowerCase()) {
      const existing = await prisma.ageGroup.findUnique({
        where: { name: trimmedName },
      });
      if (existing && existing.id !== id) {
        throw new Error(`Kelas usia ${trimmedName} sudah digunakan.`);
      }
    }

    return prisma.ageGroup.update({
      where: { id },
      data: {
        name: trimmedName,
        status: data.status || ag.status,
        notes: data.notes?.trim() || null,
      },
    });
  }

  // hapus
  static async deleteAgeGroup(id: number) {
    const ag = await prisma.ageGroup.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            students: true,
            trainingSessions: true,
            reportCards: true,
          },
        },
      },
    });

    if (!ag) {
      throw new Error("Kelas usia tidak ditemukan.");
    }

    if (ag._count.students > 0) {
      throw new Error(
        `Tidak dapat menghapus kelas usia ${ag.name} karena masih memiliki ${ag._count.students} siswa terdaftar.`,
      );
    }

    if (ag._count.trainingSessions > 0) {
      throw new Error(
        `Tidak dapat menghapus kelas usia ${ag.name} karena memiliki riwayat sesi latihan.`,
      );
    }

    if (ag._count.reportCards > 0) {
      throw new Error(
        `Tidak dapat menghapus kelas usia ${ag.name} karena memiliki data raport siswa.`,
      );
    }

    return prisma.ageGroup.delete({
      where: { id },
    });
  }
}
