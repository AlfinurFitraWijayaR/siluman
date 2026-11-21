"use client";

import { useActionState, useState } from "react";
import { loginAction, type LoginActionResult } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  Lock,
  User,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<
    LoginActionResult | null,
    FormData
  >(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="grid min-h-screen w-full lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)] bg-[#f7f6f0] text-[#1c2720] antialiased">
      {/* PANEL KIRI*/}
      <section
        className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-[#172720] text-white px-6 py-0 sm:px-12 lg:px-16 lg:py-12"
        aria-label="Informasi sistem SILUMAN"
      >
        {/* Subtle decorative radial glow & ring watermarks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[170px] top-[22%] h-[460px] w-[460px] rounded-full border border-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[110px] top-[calc(22%+52px)] h-[340px] w-[340px] rounded-full border border-white/5"
        />

        {/* Main Content Brand */}
        <div className="relative z-10 max-w-[428px] my-auto">
          <h1 className="text-8xl font-semibold leading-[1.08] tracking-tight text-white">
            Kelola pembinaan,
            <br />
            bangun{" "}
            <em className="font-serif italic font-normal text-[#e9a66b]">
              prestasi.
            </em>
          </h1>

          <p className="mt-3 text-xs lg:text-sm text-[#8e988f] leading-relaxed">
            Kelola potensi dan bakat sepak bola muda secara profesional. Dari
            manajemen data pemain, rekam latihan, hingga evaluasi perkembangan
            performa dalam satu platform modern.
          </p>
        </div>
      </section>

      {/* PANEL KANAN*/}
      <section
        className="flex flex-col justify-between p-6 sm:p-10 lg:px-16 lg:py-12"
        aria-labelledby="login-heading"
      >
        {/* Form Container */}
        <div className="mx-auto w-full max-w-[400px] my-auto py-8">
          <div className="mb-6 flex justify-center">
            <Image src={"/logo/logo.svg"} height={350} width={350} alt="" />
          </div>

          <form action={formAction} className="space-y-5" autoComplete="on">
            {/* Username / Email */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="username"
                  className="text-xs font-semibold text-[#2b3830]"
                >
                  Username atau Email
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Masukkan username atau email"
                  autoComplete="username"
                  required
                  autoFocus
                  disabled={isPending}
                  className={`h-11 p-3.5 text-sm rounded-lg border-[#dedfd6] bg-white text-[#172720] shadow-2xs placeholder:text-[#8e988f] focus-visible:border-[#172720] focus-visible:ring-[#172720]/15 ${
                    state?.fieldErrors?.username
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                      : ""
                  }`}
                />
              </div>
              {state?.fieldErrors?.username && (
                <p className="text-[11px] font-medium text-red-600">
                  {state.fieldErrors.username[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold text-[#2b3830]"
                >
                  Kata Sandi
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi"
                  autoComplete="current-password"
                  required
                  disabled={isPending}
                  className={`h-11 p-3.5 text-sm rounded-lg border-[#dedfd6] bg-white text-[#172720] shadow-2xs placeholder:text-[#8e988f] focus-visible:border-[#172720] focus-visible:ring-[#172720]/15 ${
                    state?.fieldErrors?.password
                      ? "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-200"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-controls="password"
                  aria-pressed={showPassword}
                  className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 text-xs font-medium text-[#737d72] hover:text-[#172720] rounded-md transition-colors"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
              {state?.fieldErrors?.password && (
                <p className="text-[11px] font-medium text-red-600">
                  {state.fieldErrors.password[0]}
                </p>
              )}
            </div>

            {/* Error Alert */}
            {state?.error && (
              <div
                className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50/90 p-3.5 text-xs text-red-800 shadow-xs"
                role="alert"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span className="leading-snug">{state.error}</span>
              </div>
            )}

            {/* Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer w-full h-11 rounded-lg bg-[#172720] hover:bg-[#24372e] text-white shadow-sm transition-all duration-200 group flex items-center justify-center gap-2"
            >
              <span>{isPending ? "Loading..." : "Masuk"}</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </form>
        </div>

        {/* Login Panel Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#8e988f] pt-4 border-t border-[#dedfd6]/70">
          <span>SILUMAN v1.0</span>
          <span>Copyright © 2026</span>
        </footer>
      </section>
    </main>
  );
}
