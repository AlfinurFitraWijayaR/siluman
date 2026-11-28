"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AgeGroupStatus } from "@/generated/prisma/enums";
import {
  createAgeGroupAction,
  updateAgeGroupAction,
} from "@/lib/actions/age-groups";
import type { AgeGroupListItemDTO } from "@/lib/services/age-group.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

interface ModalAgeGroupFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: AgeGroupListItemDTO | null;
  onSuccess: (message: string) => void;
}

export function ModalAgeGroupForm({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}: ModalAgeGroupFormProps) {
  const isEdit = !!initialData;
  const [name, setName] = useState("");
  const [status, setStatus] = useState<AgeGroupStatus>(AgeGroupStatus.AKTIF);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setStatus(initialData.status);
      setNotes(initialData.notes || "");
    } else {
      setName("");
      setStatus(AgeGroupStatus.AKTIF);
      setNotes("");
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
    formData.append("status", status);
    formData.append("notes", notes.trim());

    let res;
    if (isEdit && initialData) {
      res = await updateAgeGroupAction(initialData.id, null, formData);
    } else {
      res = await createAgeGroupAction(null, formData);
    }

    setIsSubmitting(false);

    if (res.success) {
      onSuccess(
        isEdit
          ? `Kelas usia ${name} berhasil diperbarui.`
          : `Kelas usia ${name} berhasil ditambahkan.`,
      );
      onClose();
    } else {
      setErrorMessage(
        res.error ||
          (res.fieldErrors?.name
            ? res.fieldErrors.name[0]
            : "Gagal memproses data kelas usia."),
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
            Ubah Kelas Usia
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
            <label
              htmlFor="agName"
              className="text-[#555555] font-medium block mb-1"
            >
              Nama kelas usia
            </label>
            <Input
              id="agName"
              type="text"
              required
              placeholder="cth: U-10, U-12, U-15"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="status" className="text-[#555555] block mb-1">
              Status
            </label>
            <Select
              value={status}
              onValueChange={(val) => setStatus(val as AgeGroupStatus)}
            >
              <SelectTrigger className="w-full h-9 bg-white">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AgeGroupStatus.AKTIF}>Aktif</SelectItem>
                <SelectItem value={AgeGroupStatus.NONAKTIF}>
                  Nonaktif
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer text-xs h-8 px-4 bg-[#172720] hover:bg-[#23372d] text-white"
            >
              {isSubmitting
                ? "Menyimpan..."
                : isEdit
                  ? "Simpan Perubahan"
                  : "Tambah Kelas"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
