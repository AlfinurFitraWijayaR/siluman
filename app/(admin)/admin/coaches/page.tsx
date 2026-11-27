import { CoachService } from "@/lib/services/coach.service";
import { CoachesClient } from "@/components/coaches/coaches-client";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function AdminCoachesPage() {
  const coaches = await CoachService.getCoaches();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-[20px] font-semibold text-[#171717]">
            Data Pelatih
          </h1>
          <p className="text-[13px] font-normal text-[#555555]">
            Kelola data pelatih SSB Mundinglaya.
          </p>
        </div>

        <Link
          href="/admin/coaches/create"
          className="cursor-pointer inline-flex items-center justify-center gap-1 px-2 py-2 rounded-md bg-[#172720] hover:bg-[#23372d] text-white text-[13px] font-medium transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Tambah Pelatih</span>
        </Link>
      </div>
      <CoachesClient coaches={coaches} />{" "}
    </div>
  );
}
