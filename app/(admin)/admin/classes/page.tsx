import { AgeGroupService } from "@/lib/services/age-group.service";
import { ClassesClient } from "@/components/classes/classes-client";

export default async function AdminClassesPage() {
  const classes = await AgeGroupService.getAgeGroups();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[#171717]">
            Kelas Usia
          </h1>
          <p className="text-[13px] font-normal text-[#555555]">
            Kelola data kelompok kelas usia (KU)
          </p>
        </div>
      </div>
      <ClassesClient initialClasses={classes} />
    </div>
  );
}
