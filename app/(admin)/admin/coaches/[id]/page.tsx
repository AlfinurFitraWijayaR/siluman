import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CoachService } from "@/lib/services";
import { CoachDetailClient } from "@/components/coaches/coach-detail-client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminCoachDetailPage({ params }: PageProps) {
  const { id } = await params;
  const coachId = Number(id);

  if (isNaN(coachId)) {
    notFound();
  }

  const coach = await CoachService.getCoachById(coachId);

  if (!coach) {
    notFound();
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-1">
        <Link
          href="/admin/coaches"
          className="underline inline-flex items-center gap-1.5 text-xs text-[#555555] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke halaman data pelatih</span>
        </Link>
        <h1 className="text-[20px] font-semibold text-[#171717]">
          Detail Pelatih
        </h1>
      </div>

      <CoachDetailClient coach={coach} />
    </div>
  );
}
