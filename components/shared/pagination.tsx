import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  data: unknown[];
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export function Pagination({
  data,
  pageSize,
  currentPage,
  onPageChange,
  itemLabel = "data",
}: PaginationProps) {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#dedfd6] bg-[#f7f6f0]/40 text-[#555555] text-[12px]">
      <div>
        Menampilkan {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}{" "}
        s.d. {Math.min(currentPage * pageSize, totalItems)} dari {totalItems}{" "}
        {itemLabel}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="w-7 h-7 rounded border border-[#dedfd6] bg-white flex items-center justify-center text-[#555] hover:bg-[#f7f6f0] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="px-2 text-xs font-semibold text-[#171717]">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="w-7 h-7 rounded border border-[#dedfd6] bg-white flex items-center justify-center text-[#555] hover:bg-[#f7f6f0] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
