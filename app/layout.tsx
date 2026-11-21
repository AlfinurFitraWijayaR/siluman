import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SILUMAN — SSB Mundinglaya",
  description:
    "Sistem Informasi Layanan untuk Manajemen Absensi dan Nilai - SSB Mundinglaya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
