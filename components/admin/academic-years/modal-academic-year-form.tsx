"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createAcademicYearAction,
  updateAcademicYearAction,
} from "@/lib/actions/academic-years";
import type { AcademicYearListItemDTO } from "@/lib/services/academic-year.service";
import { AcademicYearStatus } from "@/generated/prisma/enums";

interface ModalAcademicYearFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: AcademicYearListItemDTO | null;
  onSuccess: (message: string) => void;
}

export function ModalAcademicYearForm({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: ModalAcademicYearFormProps) {
  const isEdit = !!initialData;
  const [name, setName] = useState("");
  const [periodeStart, setPeriodeStart] = useState("");
  const [periodeEnd, setPeriodeEnd] = useState("");
  const [isActive, setIsActive] = useState<AcademicYearStatus>(
    AcademicYearStatus.NONAKTIF,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPeriodeStart(initialData.periodeStart || "");
      setPeriodeEnd(initialData.periodeEnd || "");
      setIsActive(initialData.isActive);
    } else {
      setName("");
      setPeriodeStart("");
      setPeriodeEnd("");
      setIsActive(AcademicYearStatus.NONAKTIF);
    }
    setErrorMessage(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("periodeStart", periodeStart);
    formData.append("periodeEnd", periodeEnd);
    formData.append("isActive", isActive);

    let res;
    if (isEdit && initialData) {
      res = await updateAcademicYearAction(initialData.id, null, formData);
    } else {
      res = await createAcademicYearAction(null, formData);
    }

    setIsSubmitting(false);

    if (res.success) {
      onSuccess(
        isEdit
          ? `Tahun akademik ${name} berhasil diperbarui.`
          : `Tahun akademik ${name} berhasil ditambahkan.`,
      );
      onClose();
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

  return (
    <div
      onClick={() => {
        if (!isSubmitting) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-full max-w-md shadow-xl border border-[#dedfd6] overflow-hidden p-6 space-y-4 animate-in fade-in-0 zoom-in-95 text-xs"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#dedfd6] pb-3">
          <h3 className="text-base font-semibold text-[#171717]">
            Ubah Tahun Akademik
          </h3>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs">
            {errorMessage}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="modalAyName" className="text-[#555555] block mb-1">
              Nama tahun akademik
            </label>
            <Input
              id="modalAyName"
              type="text"
              required
              placeholder="cth: 2025/2026 Ganjil"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="modalPeriodeStart"
                className="text-[#555555] block mb-1"
              >
                Tanggal Mulai
              </label>
              <Input
                id="modalPeriodeStart"
                type="date"
                required
                value={periodeStart}
                onChange={(e) => setPeriodeStart(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="modalPeriodeEnd"
                className="text-[#555555] block mb-1"
              >
                Tanggal Akhir
              </label>
              <Input
                id="modalPeriodeEnd"
                type="date"
                required
                value={periodeEnd}
                onChange={(e) => setPeriodeEnd(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="modalIsActive"
              className="text-[#555555] block mb-1"
            >
              Status Periode
            </label>
            <Select
              value={isActive}
              onValueChange={(val) => setIsActive(val as AcademicYearStatus)}
            >
              <SelectTrigger id="modalIsActive" className="w-full h-9 bg-white">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AcademicYearStatus.AKTIF}>Aktif</SelectItem>
                <SelectItem value={AcademicYearStatus.NONAKTIF}>
                  Nonaktif
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-[#dedfd6]">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={onClose}
              className="cursor-pointer px-3 h-8 text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer px-4 h-8 text-xs"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
