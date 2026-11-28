"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ModalDelete } from "@/components/shared/modalDelete";
import {
  createAcademicYearAction,
  deleteAcademicYearAction,
} from "@/lib/actions/academic-years";
import type { AcademicYearListItemDTO } from "@/lib/services/academic-year.service";
import { ModalAcademicYearForm } from "./modal-academic-year-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Trash2 } from "lucide-react";
import { AcademicYearStatus } from "@/generated/prisma/enums";

interface AcademicYearsClientProps {
  initialAcademicYears: AcademicYearListItemDTO[];
}

export function AcademicYearsClient({
  initialAcademicYears,
}: AcademicYearsClientProps) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<AcademicYearListItemDTO | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<AcademicYearListItemDTO | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form tambah di bagian atas
  const [name, setName] = useState("");
  const [periodeStart, setPeriodeStart] = useState("");
  const [periodeEnd, setPeriodeEnd] = useState("");
  const [isActive, setIsActive] = useState<AcademicYearStatus>(
    AcademicYearStatus.NONAKTIF,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("periodeStart", periodeStart);
    formData.append("periodeEnd", periodeEnd);
    formData.append("isActive", isActive);

    const res = await createAcademicYearAction(null, formData);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(`Tahun akademik ${name} berhasil ditambahkan.`);
      setName("");
      setPeriodeStart("");
      setPeriodeEnd("");
      setIsActive(AcademicYearStatus.NONAKTIF);
      router.refresh();
    } else {
      setErrorMessage(
        res.error ||
          (res.fieldErrors?.name
            ? res.fieldErrors.name[0]
            : res.fieldErrors?.periodeEnd
              ? res.fieldErrors.periodeEnd[0]
              : "Gagal memproses data tahun akademik."),
      );
    }
  };

  const handleOpenEdit = (ay: AcademicYearListItemDTO) => {
    setSelectedAcademicYear(ay);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await deleteAcademicYearAction(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      setSuccessMessage(
        `Tahun akademik ${deleteTarget.name} berhasil dihapus.`,
      );
      router.refresh();
    } else {
      setErrorMessage(res.error || "Gagal menghapus tahun akademik.");
    }
  };

  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex justify-between items-center">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 font-bold hover:opacity-80 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs flex justify-between items-center">
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-700 font-bold hover:opacity-80 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Tambah Data Tahun Akademik */}
      <div className="bg-white/70 overflow-hidden shadow-xs">
        <div className="px-5 py-3">
          <p className="text-[13px] font-medium text-[#171717] mb-3">
            Tambah Tahun Akademik
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* nama */}
              <div>
                <label
                  htmlFor="ayName"
                  className="text-[#555555] block mb-1 text-xs"
                >
                  Nama Tahun Akademik
                </label>
                <Input
                  id="ayName"
                  type="text"
                  required
                  placeholder="cth: 2025/2026 Ganjil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* tgl mulai */}
              <div>
                <label
                  htmlFor="periodeStart"
                  className="text-[#555555] block mb-1 text-xs"
                >
                  Tanggal Mulai
                </label>
                <Input
                  id="periodeStart"
                  type="date"
                  required
                  value={periodeStart}
                  onChange={(e) => setPeriodeStart(e.target.value)}
                />
              </div>

              {/* tgl akhir */}
              <div>
                <label
                  htmlFor="periodeEnd"
                  className="text-[#555555] block mb-1 text-xs"
                >
                  Tanggal Akhir
                </label>
                <Input
                  id="periodeEnd"
                  type="date"
                  required
                  value={periodeEnd}
                  onChange={(e) => setPeriodeEnd(e.target.value)}
                />
              </div>

              {/* status */}
              <div>
                <label
                  htmlFor="isActive"
                  className="text-[#555555] block mb-1 text-xs"
                >
                  Status
                </label>
                <Select
                  value={isActive}
                  onValueChange={(val) =>
                    setIsActive(val as AcademicYearStatus)
                  }
                >
                  <SelectTrigger
                    id="isActive"
                    className="w-full h-9 bg-white text-xs"
                  >
                    <SelectValue placeholder="Pilih status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={AcademicYearStatus.AKTIF}>
                      Aktif
                    </SelectItem>
                    <SelectItem value={AcademicYearStatus.NONAKTIF}>
                      Nonaktif
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-0.5">
              <Button
                type="submit"
                variant="default"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Tabel Data Tahun Akademik */}
      <div className="bg-white/70 overflow-hidden shadow-xs rounded-lg">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Tahun Akademik</TableHead>
                <TableHead className="text-center w-70">Periode</TableHead>
                <TableHead className="text-center w-24">Status</TableHead>
                <TableHead className="text-right w-60">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialAcademicYears.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-12 text-center text-[#555555] text-xs"
                  >
                    Belum ada data tahun akademik yang terdaftar.
                  </td>
                </tr>
              ) : (
                initialAcademicYears.map((ay) => (
                  <TableRow key={ay.id} className="text-xs">
                    <TableCell className="font-medium text-[#171717]">
                      {ay.name}
                    </TableCell>
                    <TableCell className="text-center text-[#555555]">
                      {formatDateDisplay(ay.periodeStart)} -{" "}
                      {formatDateDisplay(ay.periodeEnd)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={`${
                          ay.isActive === AcademicYearStatus.AKTIF
                            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {ay.isActive === AcademicYearStatus.AKTIF
                          ? "Aktif"
                          : "Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-right justify-end gap-1.5">
                        <Button
                          title="Ubah"
                          type="button"
                          variant="secondary"
                          size="icon"
                          onClick={() => handleOpenEdit(ay)}
                          className="cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            setErrorMessage(null);
                            setSuccessMessage(null);
                            setDeleteTarget(ay);
                          }}
                          title="Hapus"
                          className="cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Modal Form Ubah */}
      <ModalAcademicYearForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={selectedAcademicYear}
        onSuccess={(msg) => {
          setSuccessMessage(msg);
          router.refresh();
        }}
      />

      {/* Modal Konfirmasi Hapus */}
      <ModalDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isSubmitting={isDeleting}
        entityName="Tahun Akademik"
        itemName={deleteTarget?.name || ""}
      />
    </div>
  );
}
