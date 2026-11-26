"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { logoutAction } from "@/lib/actions";

interface TopbarProps {
  user?: {
    name?: string;
    role?: string;
    profilePhoto?: string | null;
  };
}

export function Topbar({
  user = {
    name: "User",
    role: "Administrator",
    profilePhoto: null,
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
    <header className="h-[50px] px-4 md:px-6 lg:px-8 flex items-center justify-between bg-[#172720] relative z-20">
      {/* Brand logo */}
      <Image
        src="/logo/LOGOSILUMAN.svg"
        alt="SILUMAN"
        width={135}
        height={135}
        className="object-contain"
      />

      {/* User profile dropdown section */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="cursor-pointer select-none flex items-center"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {/* User avatar / profile photo */}
          {user.profilePhoto ? (
            <div className="w-9 h-9 rounded-full overflow-hidden border border-[#23372d] shrink-0 relative shadow-2xs">
              <Image
                src={user.profilePhoto}
                alt={user.name || "User Avatar"}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-[#dedfd6] text-[#23372d] flex items-center justify-center font-bold text-sm shadow-2xs border border-[#23372d] shrink-0">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-[#dedfd6] py-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-100">
            {/* Header info user inside dropdown */}
            <div className="px-3.5 py-1 border-b border-[#dedfd6]/70">
              <p className="text-[13px] font-semibold text-[#172720] truncate capitalize">
                {user.name}
              </p>
              <p className="text-[11px] text-[#7a8379] truncate capitalize">
                {user.role}
              </p>
            </div>

            {/* Logout Action Button */}
            <form action={logoutAction} className="p-1">
              <button
                type="submit"
                className="px-3 py-0.5 text-sm text-red-600  cursor-pointer text-[13px]"
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
