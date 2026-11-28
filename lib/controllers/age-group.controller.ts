"use server";

import { revalidatePath } from "next/cache";
import { AgeGroupService } from "../services/age-group.service";
import { ageGroupSchema } from "../validations";
import { AgeGroupStatus } from "../../generated/prisma/enums";

export interface AgeGroupActionResult {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  ageGroupId?: number;
}

export async function createAgeGroupAction(
  prevState: AgeGroupActionResult | null,
  formData: FormData,
): Promise<AgeGroupActionResult> {
  try {
    const rawData = {
      name: formData.get("name")?.toString()?.trim() || "",
      status: (formData.get("status")?.toString() ||
        AgeGroupStatus.AKTIF) as AgeGroupStatus,
      notes: formData.get("notes")?.toString()?.trim() || null,
    };

    const validation = ageGroupSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        error: "Validasi gagal. Periksa kembali form kelas usia.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    const ageGroup = await AgeGroupService.createAgeGroup(validation.data);

    revalidatePath("/admin/classes");
    revalidatePath("/admin/students");
    return { success: true, ageGroupId: ageGroup.id };
  } catch (error: any) {
    console.error("createAgeGroupAction error:", error);
    const safeMessage =
      typeof error.message === "string" &&
      !error.message.includes("invocation") &&
      !error.message.includes("prisma")
        ? error.message
        : "Gagal menyimpan kelas usia. Silakan coba kembali.";
    return {
      error: safeMessage,
    };
  }
}

export async function updateAgeGroupAction(
  id: number,
  prevState: AgeGroupActionResult | null,
  formData: FormData,
): Promise<AgeGroupActionResult> {
  try {
    const rawData = {
      name: formData.get("name")?.toString()?.trim() || "",
      status: (formData.get("status")?.toString() ||
        AgeGroupStatus.AKTIF) as AgeGroupStatus,
      notes: formData.get("notes")?.toString()?.trim() || null,
    };

    const validation = ageGroupSchema.safeParse(rawData);
    if (!validation.success) {
      return {
        error: "Validasi gagal. Periksa kembali form kelas usia.",
        fieldErrors: validation.error.flatten().fieldErrors,
      };
    }

    await AgeGroupService.updateAgeGroup(id, validation.data);

    revalidatePath("/admin/classes");
    revalidatePath("/admin/students");
    return { success: true, ageGroupId: id };
  } catch (error: any) {
    console.error("updateAgeGroupAction error:", error);
    const safeMessage =
      typeof error.message === "string" &&
      !error.message.includes("invocation") &&
      !error.message.includes("prisma")
        ? error.message
        : "Gagal memperbarui kelas usia. Silakan coba kembali.";
    return {
      error: safeMessage,
    };
  }
}

export async function deleteAgeGroupAction(
  id: number,
): Promise<AgeGroupActionResult> {
  try {
    await AgeGroupService.deleteAgeGroup(id);
    revalidatePath("/admin/classes");
    revalidatePath("/admin/students");
    return { success: true };
  } catch (error: any) {
    console.error("deleteAgeGroupAction error:", error);
    const safeMessage =
      typeof error.message === "string" &&
      !error.message.includes("invocation") &&
      !error.message.includes("prisma")
        ? error.message
        : "Gagal menghapus kelas usia.";
    return {
      error: safeMessage,
    };
  }
}
