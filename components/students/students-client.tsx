"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Trash2, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteStudentAction } from "@/lib/actions/students";
import { StudentStatus, DocumentStatus } from "@/generated/prisma/enums";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Pagination } from "../shared/pagination";
import { ModalDelete } from "../shared/modalDelete";
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

export interface StudentListItem {
  nis: string;
  name: string;
  status: StudentStatus;
  ageGroup: {
    id: number;
    name: string;
  } | null;
  documents: {
    id: number;
    status: DocumentStatus;
    notes: string | null;
  }[];
}

interface StudentsClientProps {
  students: StudentListItem[];
  ageGroups: { id: number; name: string }[];
}

export function StudentsClient({ students, ageGroups }: StudentsClientProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgeGroup, setSelectedAgeGroup] =
    useState<string>("Semua Kelas");

  const [deleteTarget, setDeleteTarget] = useState<StudentListItem | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination (10 rows per page)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filter logic langsung dari props students (Single Source of Truth)
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchClass =
      selectedAgeGroup === "Semua Kelas" ||
      (s.ageGroup && s.ageGroup.name === selectedAgeGroup);
    return matchSearch && matchClass;
  });

  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsSubmitting(true);
    const res = await deleteStudentAction(deleteTarget.nis);
    setIsSubmitting(false);
    if (res.success) {
      setDeleteTarget(null);
      router.refresh();
    } else {
      alert(res.error || "Gagal menghapus siswa");
    }
  };

  return (
    <>
      {/* Filter & Search Bar */}
      <div className="flex flex-row items-center justify-end gap-3">
        {/* Filter Kelas Usia */}
        <div className="w-32">
          <Select
            value={selectedAgeGroup}
            onValueChange={(value) => {
              setSelectedAgeGroup(value ?? "Semua Kelas");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full h-[44px] bg-white/70 text-[13px] text-[#555]">
              <SelectValue placeholder="Pilih Kelas Usia" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Kelas Usia</SelectLabel>
                <SelectItem value="Semua Kelas">Semua Kelas</SelectItem>
                {ageGroups.map((age) => (
                  <SelectItem key={age.id} value={age.name}>
                    {age.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-[260px]">
          <Input
            type="text"
            placeholder="Cari nama atau NIS siswa..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white/70 pl-10 pr-3.5 text-[13px]"
          />
          <Search className="w-4 h-4 text-[#8e988f] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Tabel Data Siswa */}
      <div className="bg-white/70 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">NIS</TableHead>
                <TableHead>Nama Siswa</TableHead>
                <TableHead className="text-center w-35">Kelas Usia</TableHead>
                <TableHead className="text-center w-25">Dokumen</TableHead>
                <TableHead className="text-right w-25">Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#555555]">
                    Tidak ada data siswa yang ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((st) => {
                  const docStatus =
                    st.documents[0]?.status || DocumentStatus.BELUM_LENGKAP;
                  const isVerified = docStatus === DocumentStatus.TERVERIFIKASI;

                  return (
                    <Fragment key={st.nis}>
                      <TableRow>
                        <TableCell className="font-medium">{st.nis}</TableCell>
                        <TableCell>
                          <Link
                            href={`/admin/students/${st.nis}`}
                            className="underline hover:text-[#c87c40] transition-colors"
                          >
                            {st.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="inline-block px-4.5 text-[13px]">
                            {st.ageGroup?.name || "-"}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            className={`${
                              isVerified
                                ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                            }`}
                          >
                            {isVerified ? "Lengkap" : "Belum Lengkap"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            className={`${
                              st.status === StudentStatus.AKTIF
                                ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
                                : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
                            }`}
                          >
                            {st.status === StudentStatus.AKTIF
                              ? "Aktif"
                              : "Nonaktif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-right justify-end gap-1.5">
                            <Link
                              href={`/admin/students/${st.nis}`}
                              title="Detail"
                              className="cursor-pointer w-8 h-8 rounded-md bg-white border border-[#dedfd6] flex items-center justify-center text-[#555] hover:text-[#172720] hover:bg-[#f7f6f0] transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setDeleteTarget(st)}
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

        <Pagination
          currentPage={currentPage}
          data={filteredStudents}
          pageSize={pageSize}
          itemLabel="siswa"
          onPageChange={(p) => setCurrentPage(p)}
        />
      </div>

      {/* modal delete siswa */}
      {deleteTarget && (
        <ModalDelete
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          isSubmitting={isSubmitting}
          entityName="Siswa"
          itemName={deleteTarget?.name ?? ""}
        />
      )}
    </>
  );
}
