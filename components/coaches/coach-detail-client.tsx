"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Camera, Eye, EyeOff } from "lucide-react";
import { updateCoachAction } from "@/lib/actions/coaches";
import type { CoachListItemDTO } from "@/lib/services/coach.service";
import { CoachStatus } from "@/generated/prisma/enums";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CoachDetailClientProps {
  coach: CoachListItemDTO;
}

export function CoachDetailClient({ coach }: CoachDetailClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State status & foto profil
  const [status, setStatus] = useState<CoachStatus>(coach.status);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    coach.profilePhoto,
  );
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage(
        "File yang diunggah harus berupa gambar (JPG, PNG, atau WebP).",
      );
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setErrorMessage("Ukuran gambar maksimal adalah 1MB.");
      return;
    }

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set("status", status);
    formData.set("profilePhoto", photoPreview || "");
    console.log(formData);

    const res = await updateCoachAction(coach.id, null, formData);
    console.log(res);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage("Data pelatih berhasil diperbarui.");
      router.refresh();
    } else {
      setErrorMessage(res.error || "Gagal memperbarui data pelatih.");
    }
  };

  const formattedDob = coach.dateOfBirth
    ? new Date(coach.dateOfBirth).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";

  return (
    <div className="space-y-6 -mt-4">
      {successMessage && (
        <div className="p-3.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-xs">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
        {/* PANEL KIRI */}
        <div className="bg-white/70 rounded-md border border-[#dedfd6] overflow-hidden flex flex-col justify-between">
          {/* Avatar Profil & Info */}
          <div className="p-6 flex flex-col items-center text-center">
            <div className="relative group w-50 h-50 rounded-full bg-[#f7f6f0] border border-[#dedfd6] flex items-center justify-center font-bold text-3xl text-[#172720] mb-2 overflow-hidden shadow-2xs">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt={coach.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                coach.username[0]?.toUpperCase() || "P"
              )}

              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/45 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-[11px]"
              >
                <Camera className="w-5 h-5" />
                <span>{photoPreview ? "Ganti" : "Upload"}</span>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />

            <h2 className="text-base font-semibold text-[#171717] capitalize">
              {coach.username}
            </h2>

            <div className="mt-2 flex items-center justify-center gap-10 text-xs">
              <Badge
                className={
                  status === CoachStatus.AKTIF
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }
              >
                {status === CoachStatus.AKTIF ? "Aktif" : "Nonaktif"}
              </Badge>
              <Badge variant="secondary">
                {coach.license || "Belum ada lisensi"}
              </Badge>
            </div>
          </div>

          {/* Info Card List Bawah Profil */}
          <div className="divide-y divide-[#dedfd6]/70 border-t border-[#dedfd6] bg-[#f7f6f0]/30 text-xs px-6 py-3 pb-4 space-y-1">
            <div>
              <span className="text-[#8e988f] block">
                Tempat, Tanggal Lahir
              </span>
              <p className="font-medium text-[#171717] mt-0.5">
                {coach.placeOfBirth || "-"}, {formattedDob}
              </p>
            </div>
            <div className="pt-5">
              <span className="text-[#8e988f] block">Alamat</span>
              <p className="font-medium text-[#171717] mt-0.5 capitalize">
                {coach.address}
              </p>
            </div>
            <div className="pt-5">
              <span className="text-[#8e988f] block">Nomor Handphone</span>
              <p className="font-medium text-[#171717] mt-0.5">
                {coach.phone || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* PANEL KANAN */}
        <div className="bg-white/70 rounded-md border border-[#dedfd6] overflow-hidden">
          <div className="px-6 py-2 bg-[#d9d9d9]/30 border-b border-[#dedfd6]">
            <h2 className="text-[13px] font-semibold text-[#171717]">
              Data Diri
            </h2>
          </div>

          <form
            onSubmit={handleUpdate}
            className="px-6 py-3 space-y-3.5 text-xs"
          >
            {/* Auth */}
            <div>
              <span className="text-[#555555] font-medium block mb-0.5">
                Kredensial Akun
              </span>
              {/* Username & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="username"
                    className="text-[#8e988f] block mb-1"
                  >
                    Username
                  </label>
                  <Input
                    id="username"
                    type="text"
                    name="username"
                    defaultValue={coach.username}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-[#8e988f] block mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    defaultValue={coach.email}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="text-[#8e988f] block mb-1">Password</label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      value={coach.plainPassword || "••••••••"}
                      disabled
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="text-[#8e988f] block mb-1"
                  >
                    Ubah Password (Opsional)
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showNewPassword ? "text" : "password"}
                      name="password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. TTL */}
            <div>
              <span className="text-[#555555] font-medium block mb-0.5">
                Tempat, Tanggal lahir
              </span>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="placeOfBirth"
                      className="text-[#8e988f] block mb-1"
                    >
                      Tempat Lahir
                    </label>
                    <Input
                      id="placeOfBirth"
                      type="text"
                      name="placeOfBirth"
                      defaultValue={coach.placeOfBirth || ""}
                      placeholder="Tempat lahir"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="text-[#8e988f] block mb-1"
                    >
                      Tanggal Lahir
                    </label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      name="dateOfBirth"
                      defaultValue={
                        coach.dateOfBirth
                          ? new Date(coach.dateOfBirth)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. KONTAK */}
            <div>
              <span className="text-[#555555] font-medium block mb-0.5">
                Kontak
              </span>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-[#8e988f] block mb-1"
                    >
                      Nomor Handphone / WA
                    </label>
                    <Input
                      id="phone"
                      type="text"
                      name="phone"
                      defaultValue={coach.phone || ""}
                      placeholder="08xxxxxxxx"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="text-[#8e988f] block mb-1"
                    >
                      Alamat Domisili
                    </label>
                    <Input
                      type="text"
                      name="address"
                      id="address"
                      defaultValue={coach.address || ""}
                      placeholder="Alamat lengkap tempat tinggal"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. STATUS */}
            <div>
              <span className="text-[#555555] font-medium block mb-0.5">
                Status Pelatih
              </span>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="license"
                      className="text-[#8e988f] block mb-1"
                    >
                      Nama Lisensi
                    </label>
                    <Input
                      type="text"
                      name="license"
                      id="license"
                      defaultValue={coach.license || ""}
                      placeholder="Contoh: Lisensi C PSSI / Lisensi D Nasional"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="text-[#8e988f] block mb-1"
                    >
                      Status Pelatih
                    </label>
                    <Select
                      value={status}
                      onValueChange={(val) => setStatus(val as CoachStatus)}
                    >
                      <SelectTrigger className="w-full h-9 bg-white">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={CoachStatus.AKTIF}>Aktif</SelectItem>
                        <SelectItem value={CoachStatus.NONAKTIF}>
                          Nonaktif
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* BTN ACTION */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer w-full px-2 h-8 text-xs"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
