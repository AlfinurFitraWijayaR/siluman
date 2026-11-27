import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import { Role, CoachStatus } from "../../generated/prisma/enums";

export interface CoachListItemDTO {
  id: number;
  userId: number;
  username: string;
  email: string;
  plainPassword?: string | null;
  phone: string | null;
  license: string | null;
  status: CoachStatus;
  profilePhoto: string | null;
  placeOfBirth: string | null;
  dateOfBirth: string | null;
  address: string | null;
  trainingSessionCount: number;
  reportCardCount: number;
}

export interface CreateCoachPayload {
  username: string;
  email: string;
  password: string;
  phone?: string | null;
  license?: string | null;
  status?: CoachStatus;
  profilePhoto?: string | null;
  placeOfBirth?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
}

export interface UpdateCoachPayload {
  username: string;
  email: string;
  password?: string | null;
  phone?: string | null;
  license?: string | null;
  status?: CoachStatus;
  profilePhoto?: string | null;
  placeOfBirth?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
}

export class CoachService {
  // get coach
  static async getCoaches(): Promise<CoachListItemDTO[]> {
    const rawCoaches = await prisma.coach.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            plainPassword: true,
          },
        },
        _count: {
          select: {
            trainingSessions: true,
            reportCards: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    return rawCoaches.map((c) => ({
      id: c.id,
      userId: c.user.id,
      username: c.user.username,
      email: c.user.email,
      plainPassword: c.user.plainPassword,
      phone: c.user.phone,
      license: c.license,
      status: c.status,
      profilePhoto: c.profilePhoto,
      placeOfBirth: c.placeOfBirth,
      dateOfBirth: c.dateOfBirth ? c.dateOfBirth.toISOString() : null,
      address: c.address,
      trainingSessionCount: c._count.trainingSessions,
      reportCardCount: c._count.reportCards,
    }));
  }

  // get coach berdasarkan id
  static async getCoachById(id: number): Promise<CoachListItemDTO | null> {
    const c = await prisma.coach.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone: true,
            plainPassword: true,
          },
        },
        _count: {
          select: {
            trainingSessions: true,
            reportCards: true,
          },
        },
      },
    });

    if (!c) return null;

    return {
      id: c.id,
      userId: c.user.id,
      username: c.user.username,
      email: c.user.email,
      plainPassword: c.user.plainPassword,
      phone: c.user.phone,
      license: c.license,
      status: c.status,
      profilePhoto: c.profilePhoto,
      placeOfBirth: c.placeOfBirth,
      dateOfBirth: c.dateOfBirth ? c.dateOfBirth.toISOString() : null,
      address: c.address,
      trainingSessionCount: c._count.trainingSessions,
      reportCardCount: c._count.reportCards,
    };
  }

  // create coach baru
  static async createCoach(data: CreateCoachPayload) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingEmail) {
      throw new Error(`Email ${data.email} sudah terdaftar.`);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: data.username,
          email: data.email,
          password: hashedPassword,
          plainPassword: data.password,
          role: Role.PELATIH,
          phone: data.phone || null,
        },
      });

      const coach = await tx.coach.create({
        data: {
          userId: user.id,
          license: data.license || null,
          status: data.status || CoachStatus.AKTIF,
          profilePhoto: data.profilePhoto || null,
          placeOfBirth: data.placeOfBirth || null,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          address: data.address || null,
        },
      });

      return { coach, user };
    });
  }

  // update coach
  static async updateCoach(id: number, data: UpdateCoachPayload) {
    const coach = await prisma.coach.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!coach) {
      throw new Error("Data pelatih tidak ditemukan.");
    }

    // cek email
    if (data.email !== coach.user.email) {
      const existEmail = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (existEmail && existEmail.id !== coach.userId) {
        throw new Error(`Email ${data.email} sudah digunakan.`);
      }
    }

    return prisma.$transaction(async (tx) => {
      const userUpdateData: {
        username: string;
        email: string;
        phone?: string | null;
        password?: string;
        plainPassword?: string;
      } = {
        username: data.username,
        email: data.email,
        phone: data.phone || null,
      };

      if (data.password && data.password.trim().length >= 3) {
        userUpdateData.password = await bcrypt.hash(data.password, 10);
        userUpdateData.plainPassword = data.password;
      }

      await tx.user.update({
        where: { id: coach.userId },
        data: userUpdateData,
      });

      const updatedCoach = await tx.coach.update({
        where: { id },
        data: {
          license: data.license || null,
          status: data.status || coach.status,
          profilePhoto:
            data.profilePhoto !== undefined
              ? data.profilePhoto
              : coach.profilePhoto,
          placeOfBirth: data.placeOfBirth || null,
          dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
          address: data.address || null,
        },
      });

      return updatedCoach;
    });
  }

  // delete coach
  static async deleteCoach(id: number) {
    const coach = await prisma.coach.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            trainingSessions: true,
            reportCards: true,
          },
        },
      },
    });

    if (!coach) {
      throw new Error("Data pelatih tidak ditemukan.");
    }

    if (coach._count.trainingSessions > 0 || coach._count.reportCards > 0) {
      throw new Error(
        "Tidak dapat menghapus pelatih karena sudah memiliki riwayat sesi latihan atau raport penilaian.",
      );
    }

    return prisma.user.delete({
      where: { id: coach.userId },
    });
  }
}
