"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Camera } from "lucide-react";
import {
  updateStudentAction,
  verifyStudentDocumentsAction,
  getNextNISAction,
} from "@/lib/actions/students";
import {
  Position,
  StudentStatus,
  DocumentStatus,
} from "@/generated/prisma/enums";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface StudentDetailData {
  nis: string;
  name: string;
  placeOfBirth: string | null;
  dateOfBirth: string | null;
  address: string | null;
  joinDate: string | null;
  status: StudentStatus;
  profilePhoto: string | null;
  parentName: string | null;
  phone: string | null;
  position: Position | null;
  ageGroupId: number | null;
  ageGroup: {
    id: number;
    name: string;
  } | null;
  documents: {
    id: number;
    registrationForm: string | null;
    familyCard: string | null;
    birthCertificate: string | null;
    pasPhoto: string | null;
    status: DocumentStatus;
    notes: string | null;
  }[];
}

interface StudentDetailClientProps {
  student: StudentDetailData;
  ageGroups: { id: number; name: string }[];
}

export function StudentDetailClient({ student }: StudentDetailClientProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    student.profilePhoto,
  );
  const [isSubmittingBiodata, setIsSubmittingBiodata] = useState(false);
  const [isSubmittingDocs, setIsSubmittingDocs] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State NIS otomatis saat update tahun lahir
  const [currentNis, setCurrentNis] = useState(student.nis);
  const [isLoadingNis, setIsLoadingNis] = useState(false);

  // Ambil tahun lahir asli siswa
  const originalBirthYear = student.dateOfBirth
    ? new Date(student.dateOfBirth).getFullYear()
    : null;

  const handleDateOfBirthChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const val = e.target.value;
    if (!val) return;

    const newYear = new Date(val).getFullYear();
    if (!newYear || isNaN(newYear) || newYear < 1900 || newYear > 2100) return;

    // Jika tahun lahir sama dengan tahun lahir awal siswa, kembalikan ke NIS asli
    if (originalBirthYear && newYear === originalBirthYear) {
      setCurrentNis(student.nis);
      return;
    }

    setIsLoadingNis(true);
    const res = await getNextNISAction(newYear);
    setIsLoadingNis(false);

    if (res.nis) {
      setCurrentNis(res.nis);
    }
  };

  const doc = student.documents[0];

  // States berkas Adm (ada / belum ada)
  const [hasForm, setHasForm] = useState(Boolean(doc?.registrationForm));
  const [hasBirth, setHasBirth] = useState(Boolean(doc?.birthCertificate));
  const [hasKK, setHasKK] = useState(Boolean(doc?.familyCard));
  const [hasPhoto, setHasPhoto] = useState(Boolean(doc?.pasPhoto));

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

  const handleUpdateBiodata = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingBiodata(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    if (photoPreview !== undefined) {
      formData.set("profilePhoto", photoPreview || "");
    }
    const res = await updateStudentAction(student.nis, null, formData);
    setIsSubmittingBiodata(false);

    if (res.success) {
      setSuccessMessage("Data diri siswa berhasil diperbarui.");
      if (res.newNis && res.newNis !== student.nis) {
        router.push(`/admin/students/${res.newNis}`);
      } else {
        router.refresh();
      }
    } else {
      setErrorMessage(res.error || "Gagal memperbarui data siswa.");
    }
  };

  const handleUpdateDocuments = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmittingDocs(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const allPresent = hasForm && hasBirth && hasKK && hasPhoto;
    const status = allPresent
      ? DocumentStatus.TERVERIFIKASI
      : DocumentStatus.BELUM_LENGKAP;
    const notes = [
      `Formulir: ${hasForm ? "Ada" : "Belum Ada"}`,
      `Akta: ${hasBirth ? "Ada" : "Belum Ada"}`,
      `KK: ${hasKK ? "Ada" : "Belum Ada"}`,
      `Foto: ${hasPhoto ? "Ada" : "Belum Ada"}`,
    ].join(", ");

    const res = await verifyStudentDocumentsAction(student.nis, status, notes);
    setIsSubmittingDocs(false);

    if (res.success) {
      setSuccessMessage("Status dokumen administrasi berhasil disimpan.");
      router.refresh();
    } else {
      setErrorMessage(res.error || "Gagal memperbarui dokumen.");
    }
  };

  const formattedDob = student.dateOfBirth
    ? new Date(student.dateOfBirth).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";

  const formattedJoinDate = student.joinDate
    ? new Date(student.joinDate).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";

  return (
    <>
      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 -mt-4">
        {/* PANEL KIRI */}
        <div className="bg-white/70 rounded-md border border-[#dedfd6] overflow-hidden flex flex-col justify-between">
          {/* Profil siswa */}
          <div className="p-6 flex flex-col items-center text-center">
            <div className="relative group w-28 h-28 rounded-full bg-[#f7f6f0] border border-[#dedfd6] flex items-center justify-center font-bold text-3xl text-[#172720] mb-2 overflow-hidden shadow-2xs">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoPreview}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                student.name[0]?.toUpperCase()
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
              {student.name}
            </h2>
            <div className="flex items-center justify-center gap-1.5 mt-1">
              <p className="font-medium text-xs text-[#555555]">{currentNis}</p>
              {isLoadingNis && (
                <span className="flex items-center gap-1 text-[10px] text-[#e9a66b]">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Mengupdate NIS...
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center justify-center gap-25 text-xs">
              <Badge
                className={`${
                  student.status === StudentStatus.AKTIF
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {student.status === StudentStatus.AKTIF ? "Aktif" : "Nonaktif"}
              </Badge>
              <Badge variant="secondary">
                {student.ageGroup?.name || "Belum ada kelas"}
              </Badge>
            </div>
          </div>

          {/* Info Card List Bawah Profil */}
          <div className="divide-y divide-[#dedfd6]/70 border-t border-[#dedfd6] bg-[#f7f6f0]/30 text-xs px-6 py-3 pb-4 space-y-1">
            <div>
              <span className="text-[#8e988f] block">Tanggal Lahir</span>
              <p className="font-medium text-[#171717] mt-0.5">
                {formattedDob}
              </p>
            </div>
            <div className="pt-3">
              <span className="text-[#8e988f] block">Tanggal Bergabung</span>
              <p className="font-medium text-[#171717] mt-0.5">
                {formattedJoinDate}
              </p>
            </div>
            <div className="pt-3">
              <span className="text-[#8e988f] block">Nomor Handphone</span>
              <p className="font-medium text-[#171717] mt-0.5">
                {student.phone || "-"}
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
            onSubmit={handleUpdateBiodata}
            className="px-6 py-3 space-y-3.5 text-xs"
          >
            {/* Tempat & Tanggal Lahir */}
            <div>
              <span className="text-[#555555] font-medium block mb-0.5">
                Tempat, Tanggal Lahir
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="place" className="text-[#8e988f] block mb-1">
                    Tempat
                  </label>
                  <Input
                    id="place"
                    type="text"
                    name="placeOfBirth"
                    defaultValue={student.placeOfBirth || ""}
                    placeholder="Tempat lahir"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="date" className="text-[#8e988f] block">
                      Tanggal Lahir
                    </label>
                    {currentNis !== student.nis && (
                      <span className="text-[10px] text-[#e9a66b] font-medium">
                        NIS Baru: {currentNis}
                      </span>
                    )}
                  </div>
                  <Input
                    id="date"
                    type="date"
                    name="dateOfBirth"
                    defaultValue={
                      student.dateOfBirth
                        ? new Date(student.dateOfBirth)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleDateOfBirthChange}
                  />
                </div>
              </div>
            </div>

            {/* Kontak Informasi */}
            <div>
              <span className="text-[#555555] font-medium block mb-0.5">
                Kontak Informasi
              </span>
              <div className="space-y-1.5">
                <div>
                  <label
                    htmlFor="address"
                    className="text-[#8e988f] block mb-1"
                  >
                    Alamat Tinggal
                  </label>
                  <Input
                    type="text"
                    name="address"
                    id="address"
                    defaultValue={student.address || ""}
                    placeholder="Alamat tempat tinggal lengkap..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="parentName"
                      className="text-[#8e988f] block mb-1"
                    >
                      Nama Orang Tua
                    </label>
                    <Input
                      type="text"
                      name="parentName"
                      id="parentName"
                      defaultValue={student.parentName || ""}
                      placeholder="Nama orang tua/wali"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-[#8e988f] block mb-1"
                    >
                      Nomor Handphone
                    </label>
                    <Input
                      type="text"
                      id="phone"
                      name="phone"
                      defaultValue={student.phone || ""}
                      placeholder="08xxxxxxxx"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Bermain & Keaktifan */}
            <div>
              <span className="text-[#555555] font-medium block mb-0.5">
                Status Bermain
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Posisi */}
                <div>
                  <label
                    htmlFor="position"
                    className="text-[#8e988f] block mb-1"
                  >
                    Posisi Bermain
                  </label>
                  <Select
                    id="position"
                    name="position"
                    defaultValue={student.position || undefined}
                  >
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

                {/* Status Aktif */}
                <div>
                  <label htmlFor="status" className="text-[#8e988f] block mb-1">
                    Status Keaktifan
                  </label>
                  <Select
                    id="status"
                    name="status"
                    defaultValue={student.status || undefined}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        <SelectItem value={StudentStatus.AKTIF}>
                          Aktif
                        </SelectItem>
                        <SelectItem value={StudentStatus.NONAKTIF}>
                          Nonaktif
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Hidden Input NIS, name, group */}
            <input type="hidden" name="nis" value={currentNis} />
            <input type="hidden" name="name" value={student.name} />
            <input
              type="hidden"
              name="ageGroupId"
              value={student.ageGroup?.id}
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmittingBiodata}
                className="cursor-pointer w-full px-2 h-8 text-xs"
              >
                {isSubmittingBiodata ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* PANEL BAWAH*/}
      <div className="bg-white/70 rounded-md border border-[#dedfd6] overflow-hidden">
        <div className="px-6 py-2 bg-[#d9d9d9]/30 border-b border-[#dedfd6]">
          <h2 className="text-[13px] font-semibold text-[#171717]">
            Dokumen Administrasi
          </h2>
        </div>

        <form
          onSubmit={handleUpdateDocuments}
          className="px-6 py-3 space-y-3.5 text-xs"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Formulir Pendaftaran */}
            <div className="flex justify-center items-center flex-col space-y-1">
              <span className="text-[#555555] font-medium block">
                Formulir Pendaftaran
              </span>
              <Badge
                role="button"
                tabIndex={0}
                onClick={() => setHasForm(!hasForm)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setHasForm(!hasForm);
                  }
                }}
                className={`cursor-pointer select-none transition-colors ${
                  hasForm
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {hasForm ? "Lengkap" : "Belum"}
              </Badge>
            </div>

            {/* FC Akte Kelahiran */}
            <div className="flex justify-center items-center flex-col space-y-1">
              <span className="text-[#555555] font-medium block">
                FC Akte Kelahiran
              </span>
              <Badge
                role="button"
                tabIndex={0}
                onClick={() => setHasBirth(!hasBirth)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setHasBirth(!hasBirth);
                  }
                }}
                className={`cursor-pointer select-none transition-colors ${
                  hasBirth
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {hasBirth ? "Lengkap" : "Belum"}
              </Badge>
            </div>

            {/* FC Kartu Keluarga */}
            <div className="flex justify-center items-center flex-col space-y-1">
              <span className="text-[#555555] font-medium block">
                FC Kartu Keluarga
              </span>
              <Badge
                role="button"
                tabIndex={0}
                onClick={() => setHasKK(!hasKK)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setHasKK(!hasKK);
                  }
                }}
                className={`cursor-pointer select-none transition-colors ${
                  hasKK
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {hasKK ? "Lengkap" : "Belum"}
              </Badge>
            </div>

            {/* Pas Photo (3x4) */}
            <div className="flex justify-center items-center flex-col space-y-1">
              <span className="text-[#555555] font-medium block">
                Pas Photo (3×4)
              </span>
              <Badge
                role="button"
                tabIndex={0}
                onClick={() => setHasPhoto(!hasPhoto)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setHasPhoto(!hasPhoto);
                  }
                }}
                className={`cursor-pointer select-none transition-colors ${
                  hasPhoto
                    ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                }`}
              >
                {hasPhoto ? "Lengkap" : "Belum"}
              </Badge>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isSubmittingDocs}
              className="cursor-pointer w-full px-2 h-8 text-xs"
            >
              {isSubmittingDocs ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
