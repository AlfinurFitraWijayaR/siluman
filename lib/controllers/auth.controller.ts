"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "../validations";
import { AuthService } from "../services/auth.service";

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

  let redirectUrl = "/login";
  try {
    const result = await AuthService.login(username, password, remember);
    redirectUrl = result.redirectUrl;
  } catch (error: any) {
    if ((error as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return {
      error: error.message || "Terjadi kesalahan saat memproses login.",
    };
  }

  redirect(redirectUrl);
}

export async function logoutAction() {
  await AuthService.logout();
  redirect("/login");
}
