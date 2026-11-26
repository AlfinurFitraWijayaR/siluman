import { prisma } from "../prisma";
import {
  verifyPassword,
  signToken,
  setAuthCookie,
  removeAuthCookie,
  getCurrentSession,
} from "../auth";
import { Role } from "../../generated/prisma/enums";

export class AuthService {
  // validasi kecocokan password, buat session, set cookie.
  static async login(
    usernameInput: string,
    passwordInput: string,
    remember?: boolean,
  ) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: usernameInput, mode: "insensitive" } },
          { email: { equals: usernameInput, mode: "insensitive" } },
        ],
      },
      include: {
        coach: true,
      },
    });

    if (!user) {
      throw new Error("Username atau email tidak ditemukan.");
    }

    const isMatch = await verifyPassword(passwordInput, user.password);
    if (!isMatch) {
      throw new Error("Kata sandi salah.");
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
      // Non-fatal
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

    return {
      user,
      role: user.role,
      redirectUrl: user.role === Role.ADMINISTRATOR ? "/admin" : "/coach",
    };
  }

  // hapus cookie (logout)
  static async logout() {
    await removeAuthCookie();
  }

  // dapatkan data sesi user yang sedang login
  static async getCurrentUser() {
    const session = await getCurrentSession();
    if (!session?.userId) return null;

    return prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        coach: true,
      },
    });
  }
}
