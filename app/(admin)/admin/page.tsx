import { AdminDashboardCharts } from "@/components/admin/admin-dashboard-charts";
import { buildAdminDashboardData } from "@/lib/dashboard/admin-dashboard";
import { AgeGroupService } from "@/lib/services/age-group.service";
import { CoachService } from "@/lib/services/coach.service";
import { StudentService } from "@/lib/services/student.service";
import { FileCheck, Hash, User, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const [students, coaches, ageGroups] = await Promise.all([
    StudentService.getStudents(),
    CoachService.getCoaches(),
    AgeGroupService.getAgeGroups(),
  ]);

  const { stats, ageGroupDistribution, administrationDistribution } =
    buildAdminDashboardData({ students, coaches, ageGroups });

  const cards = [
    {
      label: "Total Siswa Aktif",
      value: stats.activeStudents,
      unit: "siswa",
      icon: User,
    },
    {
      label: "Total Pelatih",
      value: stats.coaches,
      unit: "pelatih",
      icon: Users,
    },
    {
      label: "Total Berkas Lengkap",
      value: stats.verifiedAdministration,
      unit: ` dari ${stats.activeStudents} siswa aktif`,
      icon: FileCheck,
    },
    {
      label: "Total Kelas Usia",
      value: stats.ageGroups,
      unit: "kelas",
      icon: Hash,
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-[20px] font-semibold text-[#171717]">Dashboard</h1>
      <p className="text-[13px] text-[#555555]">
        Ringkasan singkat aktivitas administrator.
      </p>

      <section className="mt-4 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="flex flex-col justify-between rounded-md border border-[#dedfd6]/70 bg-white/70 p-4"
          >
            <div className="mb-4 flex h-5 w-5 items-center justify-center text-[#171717]">
              <card.icon className="h-6 w-6" strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-[13px] font-medium text-[#171717]">
                {card.label}
              </p>

              <div className="flex items-baseline gap-1">
                <span className="text-[36px] font-bold leading-none tracking-tight text-[#172720]">
                  {card.value}
                </span>
                {card.unit && (
                  <span className="text-[13px] text-[#555555]">
                    {card.unit}
                  </span>
                )}
              </div>
            </div>
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
