import { AcademicYearsClient } from "@/components/admin/academic-years/academic-years-client";
import { AcademicYearService } from "@/lib/services/academic-year.service";

export default async function AdminAcademicYearsPage() {
  const academicYears = await AcademicYearService.getAcademicYears();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[#171717]">
            Tahun Akademik
          </h1>
          <p className="text-[13px] font-normal text-[#555555]">
            Kelola data periode tahun akademik
          </p>
        </div>
      </div>
      <AcademicYearsClient initialAcademicYears={academicYears} />
    </div>
  );
}
