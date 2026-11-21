"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { logoutAction } from "@/lib/actions";

interface TopbarProps {
  user?: {
    name?: string;
    role?: string;
  };
}

export function Topbar({
  user = {
    name: "User",
    role: "Administrator",
  },
}: TopbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown jika klik di luar area
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="h-[60px] px-4 md:px-6 lg:px-8 flex items-center justify-between border-b border-[#dedfd6] bg-white relative z-20">
      {/* Brand logo */}
      <Image
        src="/logo/munding.webp"
        alt="SILUMAN"
        width={45}
        height={45}
        className="object-contain"
      />

      {/* User profile dropdown section */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="cursor-pointer select-none"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {/* User avatar circle */}
          <div className="w-9 h-9 rounded-full bg-[#172720] text-[#e9a66b] flex items-center justify-center font-bold text-sm shadow-2xs border border-[#23372d] shrink-0">
            {user.name?.[0] || "U"}
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#dedfd6] py-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-100">
            {/* Header info user inside dropdown */}
            <div className="px-3.5 py-2 border-b border-[#dedfd6]/70">
              <p className="text-[13px] font-semibold text-[#172720] truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-[#7a8379] truncate">{user.role}</p>
            </div>

            {/* Logout Action Button */}
            <form action={logoutAction} className="p-1">
              <button
                type="submit"
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-[13px]"
              >
                <span>Logout</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
