import { AdminDashboardCharts } from "@/components/admin/admin-dashboard-charts";
import { buildAdminDashboardData } from "@/lib/dashboard/admin-dashboard";
import { AgeGroupService } from "@/lib/services/age-group.service";
import { CoachService } from "@/lib/services/coach.service";
import { StudentService } from "@/lib/services/student.service";

export default async function AdminDashboardPage() {
  const [students, coaches, ageGroups] = await Promise.all([
    StudentService.getStudents(),
    CoachService.getCoaches(),
    AgeGroupService.getAgeGroups(),
  ]);

  const { stats, ageGroupDistribution, administrationDistribution } =
    buildAdminDashboardData({ students, coaches, ageGroups });

  const cards = [
    { label: "Total Siswa Aktif", value: stats.activeStudents },
    { label: "Total Pelatih", value: stats.coaches },
    { label: "Administrasi Siswa", value: stats.verifiedAdministration },
    { label: "Total Kelas Usia", value: stats.ageGroups },
  ];

  return (
    <div className="w-full">
      <h1 className="text-[20px] font-semibold leading-[36px] text-[#171717]">
        Dashboard
      </h1>
      <p className="text-[13px] font-normal leading-[18px] text-[#555555]">
        Ringkasan singkat aktivitas administrator.
      </p>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white/70 rounded-xl border border-[#dedfd6]/70 shadow-xs p-4"
          >
            <p className="text-[13px] font-medium text-[#555555]">
              {card.label}
            </p>
            <p className="mt-2 text-[24px] font-semibold leading-none text-[#172720]">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <AdminDashboardCharts
        ageGroups={ageGroupDistribution}
        administration={administrationDistribution}
      />
    </div>
  );
}
