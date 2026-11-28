"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCoachAction } from "@/lib/actions/coaches";
import type { CoachListItemDTO } from "@/lib/services/coach.service";
import { Pagination } from "@/components/shared/pagination";
import { ModalDelete } from "@/components/shared/modalDelete";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CoachesClientProps {
  coaches: CoachListItemDTO[];
}

export function CoachesClient({ coaches }: CoachesClientProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [deleteTarget, setDeleteTarget] = useState<CoachListItemDTO | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const paginatedCoaches = coaches.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    setErrorMessage(null);

    const res = await deleteCoachAction(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setDeleteTarget(null);
      router.refresh();
    } else {
      setErrorMessage(res.error || "Gagal menghapus pelatih.");
    }
  };

  return (
    <>
      {errorMessage && (
        <div className="p-3.5 mb-4 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs">
          {errorMessage}
        </div>
      )}

      <div className="bg-white/70 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pelatih</TableHead>
                <TableHead className="text-center w-36">Lisensi</TableHead>
                <TableHead className="text-center w-36">Kontak</TableHead>
                <TableHead className="text-center w-28">Status</TableHead>
                <TableHead className="text-right w-36">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCoaches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#555555]">
                    Belum ada data pelatih yang terdaftar.
                  </td>
                </tr>
              ) : (
                paginatedCoaches.map((coach) => {
                  return (
                    <Fragment key={coach.id}>
                      <TableRow>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div>
                              <Link
                                href={`/admin/coaches/${coach.id}`}
                                className="capitalize underline hover:text-[#c87c40] transition-colors font-medium text-[#171717]"
                              >
                                {coach.username}
                              </Link>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary">
                            {coach.license || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="text-[13px] text-[#171717]">
                            {coach.phone || "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={
                              coach.status === "AKTIF"
                                ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                            }
                          >
                            {coach.status === "AKTIF" ? "Aktif" : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/admin/coaches/${coach.id}`}
                              title="Lihat Detail"
                              className="cursor-pointer w-8 h-8 rounded-md bg-white border border-[#dedfd6] flex items-center justify-center text-[#555] hover:text-[#172720] hover:bg-[#f7f6f0] transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setDeleteTarget(coach)}
                              title="Hapus"
                              className="cursor-pointer text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </Fragment>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          data={coaches}
          pageSize={pageSize}
          itemLabel="pelatih"
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>

      {/* Modal Konfirmasi Hapus */}
      <ModalDelete
        isOpen={Boolean(deleteTarget)}
        entityName="Pelatih"
        itemName={deleteTarget?.username || ""}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        isSubmitting={isDeleting}
      />
    </>
  );
}
