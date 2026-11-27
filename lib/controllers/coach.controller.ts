"use server";

import { revalidatePath } from "next/cache";
import { CoachService } from "../services/coach.service";
import { createCoachSchema, updateCoachSchema } from "../validations";
import { CoachStatus } from "../../generated/prisma/enums";

export interface CoachActionResult {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  coachId?: number;
}

export async function createCoachAction(
  prevState: CoachActionResult | null,
  formData: FormData,
): Promise<CoachActionResult> {
  try {
    const rawData = {
      username: formData.get("username")?.toString()?.trim() || "",
      email: formData.get("email")?.toString()?.trim() || "",
      password: formData.get("password")?.toString() || "",
      phone: formData.get("phone")?.toString()?.trim() || null,
      license: formData.get("license")?.toString()?.trim() || null,
      status: (formData.get("status")?.toString() ||
        CoachStatus.AKTIF) as CoachStatus,
      profilePhoto: formData.get("profilePhoto")?.toString()?.trim() || null,
      placeOfBirth: formData.get("placeOfBirth")?.toString()?.trim() || null,
      dateOfBirth: formData.get("dateOfBirth")?.toString()?.trim() || null,
      address: formData.get("address")?.toString()?.trim() || null,
    };

    const validation = createCoachSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        error: "Validasi gagal. Periksa kembali form data pelatih.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const { coach } = await CoachService.createCoach(validation.data);

    revalidatePath("/admin/coaches");
    return { success: true, coachId: coach.id };
  } catch (error: any) {
    console.error("createCoachAction error:", error);
    const safeMessage =
      typeof error.message === "string" &&
      !error.message.includes("invocation") &&
      !error.message.includes("prisma")
        ? error.message
        : "Gagal menyimpan data pelatih. Silakan coba kembali.";
    return {
      error: safeMessage,
    };
  }
}

export async function updateCoachAction(
  id: number,
  prevState: CoachActionResult | null,
  formData: FormData,
): Promise<CoachActionResult> {
  try {
    const rawData = {
      username: formData.get("username")?.toString()?.trim() || "",
      email: formData.get("email")?.toString()?.trim() || "",
      password: formData.get("password")?.toString() || "",
      phone: formData.get("phone")?.toString()?.trim() || null,
      license: formData.get("license")?.toString()?.trim() || null,
      status: (formData.get("status")?.toString() ||
        CoachStatus.AKTIF) as CoachStatus,
      profilePhoto: formData.get("profilePhoto")?.toString()?.trim() || null,
      placeOfBirth: formData.get("placeOfBirth")?.toString()?.trim() || null,
      dateOfBirth: formData.get("dateOfBirth")?.toString()?.trim() || null,
      address: formData.get("address")?.toString()?.trim() || null,
    };

    const validation = updateCoachSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        error: "Validasi gagal. Periksa kembali form data pelatih.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    await CoachService.updateCoach(id, validation.data);

    revalidatePath("/admin/coaches");
    revalidatePath(`/admin/coaches/${id}`);
    return { success: true, coachId: id };
  } catch (error: any) {
    console.error("updateCoachAction error:", error);
    const safeMessage =
      typeof error.message === "string" &&
      !error.message.includes("invocation") &&
      !error.message.includes("prisma")
        ? error.message
        : "Gagal memperbarui data pelatih. Silakan coba kembali.";
    return {
      error: safeMessage,
    };
  }
}

export async function deleteCoachAction(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    await CoachService.deleteCoach(id);
    revalidatePath("/admin/coaches");
    return { success: true };
  } catch (error: any) {
    console.error("deleteCoachAction error:", error);
    return {
      success: false,
      error:
        error.message ||
        "Gagal menghapus pelatih. Pastikan tidak ada data sesi latihan atau raport terkait.",
    };
  }
}
