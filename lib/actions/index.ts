"use server";

import { redirect } from "next/navigation";
import { prisma } from "../prisma";
import { loginSchema } from "../validations";
import {
  verifyPassword,
  signToken,
  setAuthCookie,
  removeAuthCookie,
} from "../auth";
import { Role } from "../../app/generated/prisma/enums";

export interface LoginActionResult {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    username?: string[];
    password?: string[];
  };
}

export async function loginAction(
  prevState: LoginActionResult | null,
  formData: FormData,
): Promise<LoginActionResult> {
  const rawUsername = formData.get("username");
  const rawPassword = formData.get("password");
  const rawRemember = formData.get("remember");

  const validation = loginSchema.safeParse({
    username: typeof rawUsername === "string" ? rawUsername.trim() : "",
    password: typeof rawPassword === "string" ? rawPassword : "",
    remember:
      rawRemember === "1" || rawRemember === "on" || rawRemember === "true",
  });

  if (!validation.success) {
    const flattened = validation.error.flatten();
    return {
      error: "Periksa kembali data masukan Anda.",
      fieldErrors: flattened.fieldErrors,
    };
  }

  const { username, password, remember } = validation.data;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: username, mode: "insensitive" } },
          { email: { equals: username, mode: "insensitive" } },
        ],
      },
      include: {
        coach: true,
      },
    });

    if (!user) {
      return {
        error: "Username atau email tidak ditemukan.",
      };
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return {
        error: "Kata sandi salah.",
      };
    }

    const sessionDurationDays = remember ? 30 : 1;
    const expiredAt = new Date(
      Date.now() + sessionDurationDays * 24 * 60 * 60 * 1000,
    );

    try {
      await prisma.session.create({
        data: {
          userId: user.id,
          expiredAt,
        },
      });
    } catch {
      // Non-fatal if session record insertion fails
    }

    const token = await signToken(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
        coachId: user.coach?.id,
      },
      remember,
    );

    await setAuthCookie(token, remember);

    if (user.role === Role.ADMINISTRATOR) {
      redirect("/admin");
    } else {
      redirect("/coach");
    }
  } catch (error) {
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Login action error:", error);
    return {
      error:
        "Terjadi kesalahan saat memproses login. Silakan coba beberapa saat lagi.",
    };
  }
}

export async function logoutAction() {
  await removeAuthCookie();
  redirect("/login");
}
