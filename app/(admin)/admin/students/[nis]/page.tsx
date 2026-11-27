import { notFound } from "next/navigation";
import { StudentService } from "@/lib/services/student.service";
import { MasterDataService } from "@/lib/services/master-data.service";
import { StudentDetailClient } from "@/components/students/student-detail-client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    nis: string;
  }>;
}

export default async function AdminStudentDetailPage({ params }: PageProps) {
  const { nis } = await params;
  const ageGroups = await MasterDataService.getAgeGroups();
  const student = await StudentService.getStudentByNis(nis);

  if (!student) {
    notFound();
  }

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
          Detail Siswa
        </h1>
      </div>

      <StudentDetailClient student={student} ageGroups={ageGroups} />
    </div>
  );
}
