"use server";

import { revalidatePath } from "next/cache";
import { AcademicYearService } from "../services/academic-year.service";
import { academicYearSchema } from "../validations";
import { AcademicYearStatus } from "../../generated/prisma/enums";

export interface AcademicYearActionResult {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  academicYearId?: number;
}

export async function createAcademicYearAction(
  prevState: AcademicYearActionResult | null,
  formData: FormData,
): Promise<AcademicYearActionResult> {
  try {
    const rawData = {
      name: formData.get("name")?.toString()?.trim() || "",
      periodeStart: formData.get("periodeStart")?.toString()?.trim() || "",
      periodeEnd: formData.get("periodeEnd")?.toString()?.trim() || "",
      isActive: (formData.get("isActive")?.toString() ||
        AcademicYearStatus.NONAKTIF) as AcademicYearStatus,
    };

    const validation = academicYearSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        error: "Validasi gagal. Periksa kembali form tahun akademik.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const created = await AcademicYearService.createAcademicYear(
      validation.data,
    );

    revalidatePath("/admin/academic-years");
    return { success: true, academicYearId: created.id };
  } catch (error: any) {
    console.error("createAcademicYearAction error:", error);
    const safeMessage =
      typeof error.message === "string" &&
      !error.message.includes("invocation") &&
      !error.message.includes("prisma")
        ? error.message
        : "Gagal menyimpan tahun akademik. Silakan coba kembali.";
    return {
      error: safeMessage,
    };
  }
}

export async function updateAcademicYearAction(
  id: number,
  prevState: AcademicYearActionResult | null,
  formData: FormData,
): Promise<AcademicYearActionResult> {
  try {
    const rawData = {
      name: formData.get("name")?.toString()?.trim() || "",
      periodeStart: formData.get("periodeStart")?.toString()?.trim() || "",
      periodeEnd: formData.get("periodeEnd")?.toString()?.trim() || "",
      isActive: (formData.get("isActive")?.toString() ||
        AcademicYearStatus.NONAKTIF) as AcademicYearStatus,
    };

    const validation = academicYearSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        error: "Validasi gagal. Periksa kembali form tahun akademik.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    await AcademicYearService.updateAcademicYear(id, validation.data);

    revalidatePath("/admin/academic-years");
    return { success: true, academicYearId: id };
  } catch (error: any) {
    console.error("updateAcademicYearAction error:", error);
    const safeMessage =
      typeof error.message === "string" &&
      !error.message.includes("invocation") &&
      !error.message.includes("prisma")
        ? error.message
        : "Gagal memperbarui tahun akademik. Silakan coba kembali.";
    return {
      error: safeMessage,
    };
  }
}

export async function deleteAcademicYearAction(
  id: number,
): Promise<AcademicYearActionResult> {
  try {
    await AcademicYearService.deleteAcademicYear(id);
    revalidatePath("/admin/academic-years");
    return { success: true };
  } catch (error: any) {
    console.error("deleteAcademicYearAction error:", error);
    const safeMessage =
      typeof error.message === "string" &&
      !error.message.includes("invocation") &&
      !error.message.includes("prisma")
        ? error.message
        : "Gagal menghapus tahun akademik.";
    return {
      error: safeMessage,
    };
  }
}
