"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ClipboardCheck,
  FileSpreadsheet,
  User,
  Numbers,
} from "lucide-react";

interface SidebarProps {
  role?: "ADMINISTRATOR" | "PELATIH";
  academicYear?: string;
}

export function Sidebar({
  role = "ADMINISTRATOR",
  academicYear = "2025/2026",
}: SidebarProps) {
  const pathname = usePathname();

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Data Siswa",
      href: "/admin/students",
      icon: User,
    },
    {
      title: "Data Pelatih",
      href: "/admin/coaches",
      icon: Users,
    },
    {
      title: "Kelas Usia",
      href: "/admin/classes",
      icon: Numbers,
    },
    {
      title: "Tahun Akademik",
      href: "/admin/academic-years",
      icon: GraduationCap,
    },
  ];

  const coachNavItems = [
    {
      title: "Dashboard",
      href: "/coach",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      title: "Data Siswa",
      href: "/coach/students",
      icon: Users,
    },
    {
      title: "Absensi",
      href: "/coach/attendance",
      icon: ClipboardCheck,
    },
    {
      title: "Raport Nilai",
      href: "/coach/reports",
      icon: FileSpreadsheet,
    },
  ];

  const navItems = role === "ADMINISTRATOR" ? adminNavItems : coachNavItems;

  return (
    <>
      {/* SIDEBAR*/}
      <aside className="hidden lg:flex w-[274px] shrink-0 min-h-screen bg-[#172720] flex-col py-8 px-5 border-r border-[#23372d] text-white sticky top-0 h-screen overflow-y-auto">
        {/* Top Branding Section */}
        <div>
          <div className="flex flex-col items-center text-center">
            {/* Logo Container */}
            <Image
              src="/logo/logossb.webp"
              alt="Logo SSB Mundinglaya"
              width={75}
              height={75}
              priority
              className="object-contain"
            />
            <h2 className="text-[18px] mt-1 font-semibold tracking-wide text-white w-full max-w-[210px] leading-tight">
              SSB MUNDINGLAYA
            </h2>
            <p className="text-[11px] mt-1 font-medium text-[#bdc8bf]">
              Tahun Ajaran {academicYear}
            </p>
          </div>

          {/* Navigation Items */}
          <nav className="mt-10 space-y-1.5">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 ${
                    isActive
                      ? "text-white"
                      : "text-[#aebbb0] hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 stroke-[1.4] transition-colors ${
                      isActive
                        ? "text-[#e9a66b]"
                        : "text-[#aebbb0]/80 group-hover:text-[#e9a66b]"
                    }`}
                  />
                  <span className="text-[14px] leading-snug">{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* SIDEBAR FOOTER */}
      <nav
        aria-label="Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#172720] border-t border-[#23372d] px-2 py-2 flex items-center justify-around shadow-2xl safe-area-inset-bottom"
      >
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-lg transition-colors ${
                isActive ? "text-white" : "text-[#aebbb0] hover:text-white"
              }`}
            >
              <div
                className={`p-1 rounded-md transition-colors ${
                  isActive
                    ? "text-[#e9a66b]"
                    : "text-[#aebbb0] hover:text-[#e9a66b]"
                }`}
              >
                <Icon className="w-5 h-5 stroke-[1.6]" />
              </div>
              <span className="text-[10px] leading-tight mt-0.5 truncate max-w-[64px]">
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
