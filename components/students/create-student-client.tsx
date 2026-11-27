"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createStudentAction, getNextNISAction } from "@/lib/actions/students";
import { Position } from "@/generated/prisma/enums";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";

interface CreateStudentClientProps {
  ageGroups: { id: number; name: string }[];
  suggestedNIS?: string;
}

export function CreateStudentClient({
  ageGroups,
  suggestedNIS: _initialNIS = "",
}: CreateStudentClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State NIS otomatis
  const [nis, setNis] = useState("");
  const [isLoadingNis, setIsLoadingNis] = useState(false);
  const handleDateOfBirthChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value;
    if (!val) {
      setNis("");
      return;
    }

    const birthYear = new Date(val).getFullYear();
    if (
      birthYear &&
      !isNaN(birthYear) &&
      birthYear > 1900 &&
      birthYear <= 2100
    ) {
      setIsLoadingNis(true);
      const res = await getNextNISAction(birthYear);
      setIsLoadingNis(false);
      if (res.nis) {
        setNis(res.nis);
      }
    } else {
      setNis("");
    }
  };

  // State berkas persyaratan
  const toggleDocRegistration = () => {
    setDocRegistration((prev) => (prev === "ada" ? "belum ada" : "ada"));
  };
  const toggleDocBirthCert = () => {
    setDocBirthCert((prev) => (prev === "ada" ? "belum ada" : "ada"));
  };
  const toggleDocFamilyCard = () => {
    setDocFamilyCard((prev) => (prev === "ada" ? "belum ada" : "ada"));
  };
  const toggleDocPhoto = () => {
    setDocPhoto((prev) => (prev === "ada" ? "belum ada" : "ada"));
  };

  const [docRegistration, setDocRegistration] = useState<"ada" | "belum ada">(
    "belum ada",
  );
  const [docBirthCert, setDocBirthCert] = useState<"ada" | "belum ada">(
    "belum ada",
  );
  const [docFamilyCard, setDocFamilyCard] = useState<"ada" | "belum ada">(
    "belum ada",
  );
  const [docPhoto, setDocPhoto] = useState<"ada" | "belum ada">("belum ada");

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

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
    if (photoPreview) {
      formData.set("profilePhoto", photoPreview);
    }
    const allDocsReady =
      docRegistration === "ada" &&
      docBirthCert === "ada" &&
      docFamilyCard === "ada" &&
      docPhoto === "ada";

    const docNotes = [
      `Formulir: ${docRegistration}`,
      `Akta: ${docBirthCert}`,
      `KK: ${docFamilyCard}`,
      `Foto 3x4: ${docPhoto}`,
    ].join(", ");

    formData.append("docNotes", docNotes);
    formData.append(
      "docStatus",
      allDocsReady ? "TERVERIFIKASI" : "BELUM_LENGKAP",
    );

    const res = await createStudentAction(null, formData);
    setIsSubmitting(false);
    console.log(res);

    if (res.success) {
      router.push("/admin/students");
      router.refresh();
    } else {
      setErrorMessage(res.error || "Gagal menyimpan data siswa.");
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
          {/* BIODATA */}
          <div className="space-y-2">
            <div className="px-6 py-1.5 bg-[#d9d9d9]/30 border-b border-[#dedfd6]">
              <h2 className="text-[13px] font-semibold text-[#171717]">
                1. Biodata Pribadi
              </h2>
            </div>

            <div className="px-6 space-y-2">
              {/* NIS */}
              <input type="hidden" name="nis" value={nis} />

              {/* PP */}
              <div>
                <label className="text-[#555555] block mb-1.5">
                  Foto Profil (Opsional Max. 1MB)
                </label>
                <div className="flex items-center gap-4">
                  <div className="space-y-1.5 w-full">
                    <div className="flex items-center gap-2">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handlePhotoChange}
                        className="cursor-pointer"
                      />
                      {photoPreview && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={handleRemovePhoto}
                          className="cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Nama Lengkap & Alamat */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="text-[#555555] block mb-1">
                    Nama Lengkap Siswa
                  </label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    required
                    placeholder="Masukkan nama lengkap siswa"
                  />
                </div>
                <div>
                  <label
                    htmlFor="address"
                    className="text-[#555555] block mb-1"
                  >
                    Alamat Tinggal
                  </label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Alamat tempat tinggal"
                  />
                </div>
              </div>

              {/* Tempat & Tanggal Lahir */}
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="place"
                      className="text-[#555555] block mb-1"
                    >
                      Tempat
                    </label>
                    <Input
                      id="place"
                      type="text"
                      name="placeOfBirth"
                      placeholder="Tempat lahir"
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="text-[#555555] block mb-1">
                      Tanggal Lahir
                    </label>
                    <Input
                      id="date"
                      type="date"
                      name="dateOfBirth"
                      onChange={handleDateOfBirthChange}
                    />
                  </div>
                </div>
              </div>

              {/* Ortu & No HP */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="parent" className="text-[#555555] block mb-1">
                    Nama Orang Tua (Opsional)
                  </label>
                  <Input
                    id="parent"
                    type="text"
                    name="parentName"
                    placeholder="Masukkan nama orang tua"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="text-[#555555] block mb-1">
                    No. Telp / WhatsApp (Opsional)
                  </label>
                  <Input
                    type="number"
                    name="phone"
                    id="phone"
                    placeholder="Masukkan nomor telepon / WhatsApp"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div className="space-y-2">
            <div className="px-6 py-1.5 bg-[#d9d9d9]/30 border-b border-[#dedfd6]">
              <h2 className="text-[13px] font-semibold text-[#171717]">
                2. Status Keanggotaan
              </h2>
            </div>

            <div className="px-6 space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Posisi Bermain */}
                <div>
                  <label
                    htmlFor="position"
                    className="text-[#555555] block mb-1"
                  >
                    Posisi Bermain
                  </label>
                  <Select id="position" name="position">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Posisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Posisi Pemain</SelectLabel>
                        <SelectItem value={Position.KIPER}>Kiper</SelectItem>
                        <SelectItem value={Position.BELAKANG}>
                          Belakang
                        </SelectItem>
                        <SelectItem value={Position.TENGAH}>Tengah</SelectItem>
                        <SelectItem value={Position.DEPAN}>Depan</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Kelas Usia */}
                <div>
                  <label
                    htmlFor="ageGroup"
                    className="text-[#555555] block mb-1"
                  >
                    Kelas Usia
                  </label>
                  <Select
                    id="ageGroup"
                    name="ageGroupId"
                    items={ageGroups.map((ag) => ({
                      value: ag.id,
                      label: ag.name,
                    }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Kelas Usia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Kelas Usia</SelectLabel>
                        {ageGroups.map((ag) => (
                          <SelectItem key={ag.id} value={ag.id}>
                            {ag.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tanggal Bergabung */}
                <div>
                  <label
                    htmlFor="joinDate"
                    className="text-[#555555] block mb-1"
                  >
                    Tanggal Bergabung
                  </label>
                  <Input
                    type="date"
                    name="joinDate"
                    id="joinDate"
                    defaultValue={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BERKAS ADM */}
          <div className="space-y-2">
            <div className="px-6 py-1.5 bg-[#d9d9d9]/30 border-b border-[#dedfd6]">
              <h2 className="text-[13px] font-semibold text-[#171717]">
                3. Berkas Administrasi
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Formulir Pendaftaran */}
              <div className="flex justify-center items-center flex-col space-y-1">
                <label className="text-[#555555] block mb-1">
                  Formulir Pendaftaran
                </label>
                <Badge
                  role="button"
                  tabIndex={0}
                  onClick={toggleDocRegistration}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleDocRegistration();
                    }
                  }}
                  className={`cursor-pointer select-none transition-colors ${
                    docRegistration === "ada"
                      ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                  }`}
                >
                  {docRegistration === "ada" ? "Ada" : "Belum"}
                </Badge>
              </div>

              {/* Akte */}
              <div className="flex justify-center items-center flex-col space-y-1">
                <label className="text-[#555555] block mb-1">
                  Akte Kelahiran
                </label>
                <Badge
                  role="button"
                  tabIndex={0}
                  onClick={toggleDocBirthCert}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleDocBirthCert();
                    }
                  }}
                  className={`cursor-pointer select-none transition-colors ${
                    docBirthCert === "ada"
                      ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                  }`}
                >
                  {docBirthCert === "ada" ? "Ada" : "Belum"}
                </Badge>
              </div>

              {/* KK */}
              <div className="flex justify-center items-center flex-col space-y-1">
                <label className="text-[#555555] block mb-1">
                  Kartu Keluarga
                </label>
                <Badge
                  role="button"
                  tabIndex={0}
                  onClick={toggleDocFamilyCard}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleDocFamilyCard();
                    }
                  }}
                  className={`cursor-pointer select-none transition-colors ${
                    docFamilyCard === "ada"
                      ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                  }`}
                >
                  {docFamilyCard === "ada" ? "Ada" : "Belum"}
                </Badge>
              </div>

              {/* Pas Photo (3×4) */}
              <div className="flex justify-center items-center flex-col space-y-1">
                <label className="text-[#555555] block mb-1">Pas Photo</label>
                <Badge
                  role="button"
                  tabIndex={0}
                  onClick={toggleDocPhoto}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleDocPhoto();
                    }
                  }}
                  className={`cursor-pointer select-none transition-colors ${
                    docPhoto === "ada"
                      ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                  }`}
                >
                  {docPhoto === "ada" ? "Ada" : "Belum"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-center px-6 mb-3">
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
    </form>
  );
}
