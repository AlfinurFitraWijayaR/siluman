import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function CoachLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Pelatih */}
      <Sidebar role="PELATIH" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={{ name: "Pelatih", role: "Pelatih SSB" }} />
        <main className="flex-1 bg-white">{children}</main>
      </div>
    </div>
  );
}
