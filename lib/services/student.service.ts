import { prisma } from "../prisma";
import {
  DocumentStatus,
  Position,
  StudentStatus,
} from "../../generated/prisma/enums";

export interface StudentListItemDTO {
  nis: string;
  name: string;
  status: StudentStatus;
  profilePhoto: string | null;
  ageGroup: {
    id: number;
    name: string;
  } | null;
  documents: {
    id: number;
    status: DocumentStatus;
    notes: string | null;
  }[];
}

export interface StudentDetailDTO {
  nis: string;
  name: string;
  placeOfBirth: string | null;
  dateOfBirth: string | null;
  address: string | null;
  joinDate: string | null;
  status: StudentStatus;
  profilePhoto: string | null;
  parentName: string | null;
  phone: string | null;
  position: Position | null;
  ageGroupId: number | null;
  ageGroup: {
    id: number;
    name: string;
  } | null;
  documents: {
    id: number;
    registrationForm: string | null;
    familyCard: string | null;
    birthCertificate: string | null;
    pasPhoto: string | null;
    status: DocumentStatus;
    notes: string | null;
  }[];
}

export interface CreateStudentPayload {
  nis: string;
  name: string;
  placeOfBirth?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  joinDate?: string | null;
  status: StudentStatus;
  profilePhoto?: string | null;
  parentName?: string | null;
  phone?: string | null;
  position?: Position | null;
  ageGroupId?: number | null;
  docNotes?: string;
  docStatus?: DocumentStatus;
}

export interface UpdateStudentPayload {
  nis?: string;
  name: string;
  placeOfBirth?: string | null;
  dateOfBirth?: string | null;
  address?: string | null;
  joinDate?: string | null;
  status: StudentStatus;
  profilePhoto?: string | null;
  parentName?: string | null;
  phone?: string | null;
  position?: Position | null;
  ageGroupId?: number | null;
}

export class StudentService {
  // ambil data siswa.
  static async getStudents(): Promise<StudentListItemDTO[]> {
    const rawStudents = await prisma.student.findMany({
      select: {
        nis: true,
        name: true,
        status: true,
        profilePhoto: true,
        ageGroup: {
          select: {
            id: true,
            name: true,
          },
        },
        documents: {
          select: {
            id: true,
            status: true,
            notes: true,
          },
        },
      },
      orderBy: {
        nis: "asc",
      },
    });

    return rawStudents.map((st) => ({
      nis: st.nis,
      name: st.name,
      status: st.status,
      profilePhoto: st.profilePhoto,
      ageGroup: st.ageGroup,
      documents: st.documents,
    }));
  }

  // ambil data siswa berdasarkan nis.
  static async getStudentByNis(nis: string): Promise<StudentDetailDTO | null> {
    const rawStudent = await prisma.student.findUnique({
      where: { nis },
      include: {
        ageGroup: {
          select: {
            id: true,
            name: true,
          },
        },
        documents: {
          select: {
            id: true,
            registrationForm: true,
            familyCard: true,
            birthCertificate: true,
            pasPhoto: true,
            status: true,
            notes: true,
          },
        },
      },
    });

    if (!rawStudent) return null;

    return {
      nis: rawStudent.nis,
      name: rawStudent.name,
      placeOfBirth: rawStudent.placeOfBirth,
      dateOfBirth: rawStudent.dateOfBirth
        ? rawStudent.dateOfBirth.toISOString()
        : null,
      address: rawStudent.address,
      joinDate: rawStudent.joinDate ? rawStudent.joinDate.toISOString() : null,
      status: rawStudent.status,
      profilePhoto: rawStudent.profilePhoto,
      parentName: rawStudent.parentName,
      phone: rawStudent.phone,
      position: rawStudent.position,
      ageGroupId: rawStudent.ageGroupId,
      ageGroup: rawStudent.ageGroup,
      documents: rawStudent.documents,
    };
  }

  // generate nis
  static async generateNextNIS(birthYear?: number): Promise<string> {
    if (!birthYear) {
      return "";
    }

    const yearSuffix = String(birthYear).slice(-2);
    const prefix = `MDL${yearSuffix}`;
    const lastStudent = await prisma.student.findFirst({
      where: {
        nis: {
          startsWith: prefix,
        },
      },
      orderBy: { nis: "desc" },
    });

    let nextSequence = 1;
    if (lastStudent) {
      const seqStr = lastStudent.nis.slice(prefix.length);
      const seqNum = parseInt(seqStr, 10);
      if (!isNaN(seqNum)) {
        nextSequence = seqNum + 1;
      }
    }

    return `${prefix}${String(nextSequence).padStart(3, "0")}`;
  }

  // buat siswa baru.
  static async createStudent(data: CreateStudentPayload) {
    const existing = await prisma.student.findUnique({
      where: { nis: data.nis },
    });

    if (existing) {
      throw new Error(`Siswa dengan NIS ${data.nis} sudah terdaftar.`);
    }

    return prisma.student.create({
      data: {
        nis: data.nis,
        name: data.name,
        placeOfBirth: data.placeOfBirth,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        address: data.address,
        joinDate: data.joinDate ? new Date(data.joinDate) : new Date(),
        status: data.status,
        profilePhoto: data.profilePhoto || null,
        parentName: data.parentName,
        phone: data.phone,
        position: data.position,
        ageGroupId: data.ageGroupId,
        documents: {
          create: {
            status: data.docStatus || DocumentStatus.BELUM_LENGKAP,
            notes: data.docNotes || "Berkas baru diinisialisasi",
          },
        },
      },
    });
  }

  // update siswa.
  static async updateStudent(currentNis: string, data: UpdateStudentPayload) {
    const targetNis =
      data.nis && data.nis.trim() ? data.nis.trim() : currentNis;

    // Jika NIS berubah, lakukan transaksi dengan memperbarui relasi
    if (targetNis !== currentNis) {
      const existing = await prisma.student.findUnique({
        where: { nis: targetNis },
      });
      if (existing) {
        throw new Error(`Siswa dengan NIS ${targetNis} sudah terdaftar.`);
      }

      return prisma.$transaction(async (tx) => {
        // Buat record student baru dengan targetNis
        const updatedStudent = await tx.student.create({
          data: {
            nis: targetNis,
            name: data.name,
            placeOfBirth: data.placeOfBirth,
            dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
            address: data.address,
            joinDate: data.joinDate ? new Date(data.joinDate) : new Date(),
            status: data.status,
            profilePhoto:
              data.profilePhoto !== undefined ? data.profilePhoto : undefined,
            parentName: data.parentName,
            phone: data.phone,
            position: data.position,
            ageGroupId: data.ageGroupId,
          },
        });

        // Pindahkan relasi berkas, absensi, dan raport ke targetNis
        await tx.studentDocument.updateMany({
          where: { nis: currentNis },
          data: { nis: targetNis },
        });

        await tx.attendance.updateMany({
          where: { nis: currentNis },
          data: { nis: targetNis },
        });

        await tx.reportCard.updateMany({
          where: { nis: currentNis },
          data: { nis: targetNis },
        });

        // Hapus record lama
        await tx.student.delete({
          where: { nis: currentNis },
        });

        return updatedStudent;
      });
    }

    return prisma.student.update({
      where: { nis: currentNis },
      data: {
        name: data.name,
        placeOfBirth: data.placeOfBirth,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        address: data.address,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
        status: data.status,
        profilePhoto:
          data.profilePhoto !== undefined ? data.profilePhoto : undefined,
        parentName: data.parentName,
        phone: data.phone,
        position: data.position,
        ageGroupId: data.ageGroupId,
      },
    });
  }

  // hapus siswa.
  static async deleteStudent(nis: string) {
    return prisma.student.delete({
      where: { nis },
    });
  }

  // verifikasi berkas siswa.
  static async verifyDocuments(
    nis: string,
    status: DocumentStatus,
    notes?: string,
  ) {
    const existingDoc = await prisma.studentDocument.findFirst({
      where: { nis },
    });

    if (existingDoc) {
      return prisma.studentDocument.update({
        where: { id: existingDoc.id },
        data: { status, notes },
      });
    }

    return prisma.studentDocument.create({
      data: {
        nis,
        status,
        notes,
      },
    });
  }
}
