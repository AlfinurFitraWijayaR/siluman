import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CreateCoachClient } from "@/components/coaches/create-coach-client";

export default function AdminCreateCoachPage() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <Link
          href="/admin/coaches"
          className="underline inline-flex items-center gap-1.5 text-xs text-[#555555] hover:text-[#171717] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke halaman data pelatih</span>
        </Link>
        <h1 className="text-[20px] font-semibold text-[#171717]">
          Tambah Pelatih Baru
        </h1>
      </div>

      <CreateCoachClient />
    </div>
  );
}
