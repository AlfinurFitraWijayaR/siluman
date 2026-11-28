"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { createCoachAction } from "@/lib/actions/coaches";
import { CoachStatus } from "@/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CreateCoachClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State status & foto profil
  const [status, setStatus] = useState<CoachStatus>(CoachStatus.AKTIF);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        "File yang diunggah harus berupa gambar (JPG, PNG, atau WebP).",
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar maksimal adalah 2MB.");
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set("status", status);
    if (photoPreview) {
      formData.set("profilePhoto", photoPreview);
    }

    const res = await createCoachAction(null, formData);
    setIsSubmitting(false);

    if (res.success) {
      router.push("/admin/coaches");
      router.refresh();
    } else {
      setErrorMessage(res.error || "Gagal menyimpan data pelatih.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 -mt-4">
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs">
          {errorMessage}
        </div>
      )}

      <div className="bg-white/70 rounded-md border border-[#dedfd6] overflow-hidden text-xs">
        <div className="space-y-3">
          {/* 1. KREDENSIAL AKUN */}
          <div className="space-y-2">
            <div className="px-6 py-1.5 bg-[#d9d9d9]/30 border-b border-[#dedfd6]">
              <h2 className="text-[13px] font-semibold text-[#171717]">
                1. Kredensial Akun Login
              </h2>
            </div>

            <div className="px-6 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label
                    htmlFor="username"
                    className="text-[#555555] block mb-1"
                  >
                    Username Akun
                  </label>
                  <Input
                    type="text"
                    name="username"
                    id="username"
                    required
                    placeholder="Masukan nama lengkap"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-[#555555] block mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="email@gmail.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="text-[#555555] block mb-1"
                  >
                    Password
                  </label>
                  <Input
                    type="password"
                    name="password"
                    id="password"
                    required
                    placeholder="Minimal 3 karakter"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. BIODATA PRIBADI & FOTO */}
          <div className="space-y-2">
            <div className="px-6 py-1.5 bg-[#d9d9d9]/30 border-b border-[#dedfd6]">
              <h2 className="text-[13px] font-semibold text-[#171717]">
                2. Profil & Data Pribadi
              </h2>
            </div>

            <div className="px-6 space-y-2">
              {/* Foto Profil */}
              <div>
                <label className="text-[#555555] block mb-1.5">
                  Foto Profil (Max. 2MB)
                </label>
                <div className="flex items-center gap-4">
                  <div className="space-y-1.5 w-full">
                    <div className="flex items-center gap-2">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handlePhotoChange}
                      />
                      {photoPreview && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemovePhoto}
                          className="cursor-pointer text-xs text-red-600 hover:text-red-700 hover:bg-red-50 h-8 flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tempat & Tanggal Lahir */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="placeOfBirth"
                    className="text-[#555555] block mb-1"
                  >
                    Tempat Lahir
                  </label>
                  <Input
                    id="placeOfBirth"
                    type="text"
                    name="placeOfBirth"
                    placeholder="Kota kelahiran"
                  />
                </div>
                <div>
                  <label
                    htmlFor="dateOfBirth"
                    className="text-[#555555] block mb-1"
                  >
                    Tanggal Lahir
                  </label>
                  <Input id="dateOfBirth" type="date" name="dateOfBirth" />
                </div>
              </div>

              {/* Kontak */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="phone" className="text-[#555555] block mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <Input
                    type="text"
                    name="phone"
                    id="phone"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="text-[#555555] block mb-1"
                  >
                    Alamat Tempat Tinggal
                  </label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Alamat domisili lengkap"
                  />
                </div>
              </div>

              {/* Lisensi */}
              <div>
                <label htmlFor="license" className="text-[#555555] block mb-1">
                  Lisensi / Sertifikasi Pelatih
                </label>
                <Input
                  type="text"
                  name="license"
                  id="license"
                  placeholder="cth: Lisensi C PSSI / Lisensi D Nasional"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center mb-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full px-2 h-8 text-xs"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
