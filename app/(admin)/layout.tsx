import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getLayoutData } from "@/lib/data";
import { Suspense } from "react";

async function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, academicYear } = await getLayoutData();

  return (
    <div className="min-h-screen bg-[#172720] flex flex-col">
      <Topbar
        user={{
          name: user.name,
          role: user.roleLabel,
          profilePhoto: user.profilePhoto,
        }}
      />
      <div className="flex-1 flex min-w-0">
        <Sidebar role={user.role} academicYear={academicYear} />
        <div className="flex-1 bg-[#172720] min-w-0 flex flex-col">
          <main className="flex-1 bg-[#f7f6f0] rounded-tl-[23px] shadow-sm py-4 md:py-6 px-4 md:px-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#172720] flex items-center justify-center text-[#aebbb0]">
          Memuat...
        </div>
      }
    >
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </Suspense>
  );
}
