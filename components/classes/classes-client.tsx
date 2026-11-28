"use client";

import { useEffect, useState } from "react";
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
  createAgeGroupAction,
  deleteAgeGroupAction,
  updateAgeGroupAction,
} from "@/lib/actions/age-groups";
import type { AgeGroupListItemDTO } from "@/lib/services/age-group.service";
import { AgeGroupStatus } from "@/generated/prisma/enums";
import { ModalAgeGroupForm } from "./modal-age-group-form";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Eye, Trash2 } from "lucide-react";

interface ClassesClientProps {
  initialClasses: AgeGroupListItemDTO[];
}

export function ClassesClient({ initialClasses }: ClassesClientProps) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAgeGroup, setSelectedAgeGroup] =
    useState<AgeGroupListItemDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AgeGroupListItemDTO | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const isEdit = !!selectedAgeGroup;
  const [name, setName] = useState("");
  const [status, setStatus] = useState<AgeGroupStatus>(AgeGroupStatus.AKTIF);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedAgeGroup) {
      setName(selectedAgeGroup.name);
      setStatus(selectedAgeGroup.status);
      setNotes(selectedAgeGroup.notes || "");
    } else {
      setName("");
      setStatus(AgeGroupStatus.AKTIF);
      setNotes("");
    }
    setErrorMessage(null);
  }, [selectedAgeGroup, isFormOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("status", status);
    formData.append("notes", notes.trim());

    let res;
    if (isEdit && selectedAgeGroup) {
      res = await updateAgeGroupAction(selectedAgeGroup.id, null, formData);
    } else {
      res = await createAgeGroupAction(null, formData);
    }

    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage(
        isEdit
          ? `Kelas usia ${name} berhasil diperbarui.`
          : `Kelas usia ${name} berhasil ditambahkan`,
      );
      router.refresh();
      setIsFormOpen(false);
    } else {
      setErrorMessage(
        res.error ||
          (res.fieldErrors?.name
            ? res.fieldErrors.name[0]
            : "Gagal memproses data kelas usia."),
      );
    }
  };

  const handleOpenEdit = (ag: AgeGroupListItemDTO) => {
    setSelectedAgeGroup(ag);
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const res = await deleteAgeGroupAction(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      setSuccessMessage(`Kelas usia ${deleteTarget.name} berhasil dihapus.`);
      router.refresh();
    } else {
      setErrorMessage(res.error || "Gagal menghapus kelas usia.");
    }
  };

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex justify-between items-center">
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 font-bold hover:opacity-80"
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
            className="text-red-700 font-bold hover:opacity-80"
          >
            ×
          </button>
        </div>
      )}

      {/* Tambah Data Kelas Usia */}
      <div className="bg-white/70 overflow-hidden shadow-xs">
        <div className="px-5 py-3">
          <p className="text-[13px] font-medium text-[#171717]">
            Tambah kelas usia
          </p>

          <form onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="agName"
                className="text-[#555555] font-medium block mb-1"
              ></label>
              <Input
                id="agName"
                type="text"
                required
                placeholder="cth: U-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-3">
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

      {/* Tabel Data Kelas Usia */}
      <div className="bg-white/70 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-50">Kelas Usia</TableHead>
                <TableHead className="text-center w-10">Jumlah Siswa</TableHead>
                <TableHead className="text-center w-10">Status</TableHead>
                <TableHead className="text-right w-10">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialClasses.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-[#555555] text-xs"
                  >
                    Belum ada data kelas usia yang terdaftar.
                  </td>
                </tr>
              ) : (
                initialClasses.map((ag) => (
                  <TableRow key={ag.id} className="text-xs">
                    <TableCell className="font-semibold text-[#171717]">
                      {ag.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{ag.studentCount} siswa</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={`${
                          ag.status === AgeGroupStatus.AKTIF
                            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                            : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                        }`}
                      >
                        {ag.status === AgeGroupStatus.AKTIF
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
                          onClick={() => handleOpenEdit(ag)}
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
                            setDeleteTarget(ag);
                          }}
                          title="Hapus"
                          className="cursor-pointer"
                        >
                          <Trash2 />
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
      <ModalAgeGroupForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialData={selectedAgeGroup}
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
        entityName="Kelas Usia"
        itemName={deleteTarget?.name || ""}
      />
    </div>
  );
}
