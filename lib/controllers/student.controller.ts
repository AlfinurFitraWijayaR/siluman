"use server";

import { revalidatePath } from "next/cache";
import { studentSchema } from "../validations";
import { StudentService } from "../services/student.service";
import {
  DocumentStatus,
  Position,
  StudentStatus,
} from "../../generated/prisma/enums";

export interface StudentActionResult {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  newNis?: string;
}

export async function createStudentAction(
  prevState: StudentActionResult | null,
  formData: FormData,
): Promise<StudentActionResult> {
  try {
    const rawData = {
      nis: formData.get("nis")?.toString()?.trim() || "",
      name: formData.get("name")?.toString()?.trim() || "",
      placeOfBirth: formData.get("placeOfBirth")?.toString()?.trim() || null,
      dateOfBirth: formData.get("dateOfBirth")?.toString()?.trim() || null,
      address: formData.get("address")?.toString()?.trim() || null,
      joinDate: formData.get("joinDate")?.toString()?.trim() || null,
      status: (formData.get("status")?.toString() ||
        StudentStatus.AKTIF) as StudentStatus,
      parentName: formData.get("parentName")?.toString()?.trim() || null,
      phone: formData.get("phone")?.toString()?.trim() || null,
      position: (formData.get("position")?.toString() ||
        null) as Position | null,
      ageGroupId: formData.get("ageGroupId")
        ? Number(formData.get("ageGroupId"))
        : null,
    };

    const validation = studentSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        error: "Validasi gagal. Periksa kembali form data siswa.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const docNotes = formData.get("docNotes")?.toString();
    const docStatus = formData.get("docStatus")?.toString() as DocumentStatus;

    await StudentService.createStudent({
      ...validation.data,
      docNotes,
      docStatus,
    });

    revalidatePath("/admin/students");
    return { success: true };
  } catch (error: any) {
    console.error("StudentController.createStudent error:", error);
    return {
      error: error.message || "Gagal menyimpan data siswa.",
    };
  }
}

export async function updateStudentAction(
  nis: string,
  prevState: StudentActionResult | null,
  formData: FormData,
): Promise<StudentActionResult> {
  try {
    const rawData = {
      nis: formData.get("nis")?.toString()?.trim() || nis,
      name: formData.get("name")?.toString()?.trim() || "",
      placeOfBirth: formData.get("placeOfBirth")?.toString()?.trim() || null,
      dateOfBirth: formData.get("dateOfBirth")?.toString()?.trim() || null,
      address: formData.get("address")?.toString()?.trim() || null,
      joinDate: formData.get("joinDate")?.toString()?.trim() || null,
      status: (formData.get("status")?.toString() ||
        StudentStatus.AKTIF) as StudentStatus,
      parentName: formData.get("parentName")?.toString()?.trim() || null,
      phone: formData.get("phone")?.toString()?.trim() || null,
      position: (formData.get("position")?.toString() ||
        null) as Position | null,
      ageGroupId: formData.get("ageGroupId")
        ? Number(formData.get("ageGroupId"))
        : null,
    };

    const validation = studentSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        error: "Validasi gagal. Periksa data siswa.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const updated = await StudentService.updateStudent(nis, validation.data);
    const newNis = updated.nis;

    revalidatePath("/admin/students");
    revalidatePath(`/admin/students/${nis}`);
    if (newNis !== nis) {
      revalidatePath(`/admin/students/${newNis}`);
    }

    return { success: true, newNis };
  } catch (error: any) {
    console.error("StudentController.updateStudent error:", error);
    return {
      error: error.message || "Gagal memperbarui data siswa.",
    };
  }
}

export async function deleteStudentAction(
  nis: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await StudentService.deleteStudent(nis);
    revalidatePath("/admin/students");
    return { success: true };
  } catch (error: any) {
    console.error("StudentController.deleteStudent error:", error);
    return {
      success: false,
      error:
        "Tidak dapat menghapus data siswa. Pastikan tidak ada data absensi atau raport terkait.",
    };
  }
}

export async function verifyStudentDocumentsAction(
  nis: string,
  status: DocumentStatus,
  notes?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await StudentService.verifyDocuments(nis, status, notes);
    revalidatePath("/admin/students");
    revalidatePath(`/admin/students/${nis}`);
    return { success: true };
  } catch (error: any) {
    console.error("StudentController.verifyDocuments error:", error);
    return {
      success: false,
      error: error.message || "Gagal memverifikasi dokumen.",
    };
  }
}

export async function getNextNISAction(
  birthYear: number,
): Promise<{ nis: string }> {
  try {
    const nis = await StudentService.generateNextNIS(birthYear);
    return { nis };
  } catch (error: any) {
    console.error("StudentController.getNextNIS error:", error);
    return { nis: "" };
  }
}
