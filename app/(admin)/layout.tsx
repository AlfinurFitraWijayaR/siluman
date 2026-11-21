import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex">
      <Sidebar role="ADMINISTRATOR" />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={{ name: "User", role: "Administrator" }} />
        <main className="flex-1 bg-[#f7f6f0] py-2 md:py-3 lg:py-4 px-4 md:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
