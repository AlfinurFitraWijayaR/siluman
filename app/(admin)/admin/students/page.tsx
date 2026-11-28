import { StudentService } from "@/lib/services/student.service";
import { MasterDataService } from "@/lib/services/master-data.service";
import Link from "next/link";
import { Plus } from "lucide-react";
import { StudentsClient } from "@/components/admin/students/students-client";

export default async function AdminStudentsPage() {
  const students = await StudentService.getStudents();
  const ageGroups = await MasterDataService.getAgeGroups();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[#171717]">
            Data Siswa
          </h1>
          <p className="text-[13px] font-normal text-[#555555]">
            Kelola data dan berkas administrasi siswa SSB Mundinglaya.
          </p>
        </div>

        <Link
          href="/admin/students/create"
          className="cursor-pointer inline-flex items-center justify-center gap-1 px-2 py-2 rounded-md bg-[#172720] hover:bg-[#23372d] text-white text-[13px] font-medium transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Siswa</span>
        </Link>
      </div>

      <StudentsClient students={students} ageGroups={ageGroups} />
    </div>
  );
}
