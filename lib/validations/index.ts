import { z } from "zod";
import {
  Position,
  StudentStatus,
  CoachStatus,
} from "../../generated/prisma/enums";

export const loginSchema = z.object({
  username: z.string().min(1, "Username atau email wajib diisi"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
  remember: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const studentSchema = z.object({
  nis: z.string().min(1, "NIS wajib diisi"),
  name: z.string().min(2, "Nama siswa minimal 2 karakter"),
  placeOfBirth: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  joinDate: z.string().optional().nullable(),
  status: z.nativeEnum(StudentStatus).default(StudentStatus.AKTIF),
  profilePhoto: z.string().optional().nullable(),
  parentName: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  position: z.nativeEnum(Position).optional().nullable(),
  ageGroupId: z.coerce.number().optional().nullable(),
});

export type StudentInput = z.infer<typeof studentSchema>;

export const createCoachSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(3, "Password minimal 3 karakter"),
  phone: z.string().optional().nullable(),
  license: z.string().optional().nullable(),
  status: z.nativeEnum(CoachStatus).default(CoachStatus.AKTIF),
  profilePhoto: z.string().optional().nullable(),
  placeOfBirth: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export type CreateCoachInput = z.infer<typeof createCoachSchema>;

export const updateCoachSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z
    .string()
    .min(3, "Password minimal 3 karakter")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().nullable(),
  license: z.string().optional().nullable(),
  status: z.nativeEnum(CoachStatus).default(CoachStatus.AKTIF),
  profilePhoto: z.string().optional().nullable(),
  placeOfBirth: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
});

export type UpdateCoachInput = z.infer<typeof updateCoachSchema>;
