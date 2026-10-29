import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onChange }) {
  // Logika pembatasan halaman
  const getVisiblePages = (current, total) => {
    if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);

    let start = Math.max(1, current - 1);
    let end = start + 3;

    if (end >= total - 1) {
      return [total - 4, total - 3, total - 2, total - 1, total];
    }

    return [start, start + 1, start + 2, start + 3, "...", total];
  };

  const visiblePages = getVisiblePages(page, totalPages);

  const btnBase =
    "flex h-8 sm:h-9 min-w-[32px] sm:min-w-[36px] shrink-0 cursor-pointer items-center justify-center rounded-xl border text-[11px] sm:text-xs font-bold transition-all duration-200 px-2 sm:px-3 shadow-sm";

  return (
    // Penambahan sm:w-auto dan sm:justify-end di sini
    <div className="flex w-full flex-nowrap items-center justify-center gap-1.5 overflow-x-auto pb-1 font-['Plus_Jakarta_Sans',sans-serif] scrollbar-hide sm:w-auto sm:justify-end sm:gap-2 sm:pb-0">
      
      {/* Tombol Back */}
      <button
        className={`${btnBase} border-slate-200 bg-white text-slate-600 hover:bg-indigo-50 hover:text-[#5755FF] disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700/50 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700`}
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        aria-label="Sebelumnya"
      >
        <ChevronLeft className="h-4 w-4 sm:mr-1" /> 
        <span className="hidden sm:inline-block">Back</span>
      </button>

      {/* Nomor Halaman */}
      {visiblePages.map((n, idx) => {
        if (n === "...") {
          return (
            <div
              key={`dots-${idx}`}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-[11px] font-bold text-slate-400 shadow-sm dark:border-slate-700/50 dark:bg-slate-800/80 dark:text-slate-500 sm:h-9 sm:w-9 sm:text-xs"
            >
              •••
            </div>
          );
        }

        return (
          <button
            key={idx}
            onClick={() => onChange(n)}
            className={`flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border text-[11px] font-bold shadow-sm transition-all duration-200 sm:h-9 sm:w-9 sm:text-xs ${
              n === page
                ? "border-[#5755FF] bg-[#5755FF] text-white shadow-lg shadow-indigo-500/20 dark:border-[#5755FF] dark:bg-[#5755FF]"
                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-[#5755FF] dark:border-slate-700/50 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
            }`}
          >
            {n}
          </button>
        );
      })}

      {/* Tombol Next */}
      <button
        className={`${btnBase} border-slate-200 bg-white text-slate-600 hover:bg-indigo-50 hover:text-[#5755FF] disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700/50 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700`}
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Berikutnya"
      >
        <span className="hidden sm:inline-block">Next</span>
        <ChevronRight className="h-4 w-4 sm:ml-1" />
      </button>
    </div>
  );
}