import { MasterDataService } from "@/lib/services/master-data.service";
import { CreateStudentClient } from "@/components/students/create-student-client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminCreateStudentPage() {
  const ageGroups = await MasterDataService.getAgeGroups();

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <Link
          href="/admin/students"
          className="underline inline-flex items-center gap-1.5 text-xs text-[#555555] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke halaman data Siswa</span>
        </Link>
        <h1 className="text-[20px] font-semibold text-[#171717]">
          Tambah Siswa
        </h1>
      </div>
      <CreateStudentClient ageGroups={ageGroups} />;
    </div>
  );
}
