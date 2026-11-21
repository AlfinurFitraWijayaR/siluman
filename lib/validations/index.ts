import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username atau email wajib diisi"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
  remember: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
