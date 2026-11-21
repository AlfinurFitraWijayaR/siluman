import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { Role } from "../../app/generated/prisma/enums";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET);
export const AUTH_COOKIE_NAME = "siluman_session";

export interface SessionPayload {
  userId: number;
  username: string;
  role: Role;
  coachId?: number;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(
  payload: SessionPayload,
  remember?: boolean,
): Promise<string> {
  const expiresIn = remember ? "30d" : "1d";
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(SECRET_KEY);
}

export async function verifyToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string, remember?: boolean) {
  const cookieStore = await cookies();
  const maxAge = remember ? 30 * 24 * 60 * 60 : 24 * 60 * 60;

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(AUTH_COOKIE_NAME);
  if (!cookie?.value) return null;
  return verifyToken(cookie.value);
}
