import { useState, useRef, useEffect } from "react";
import { Search, Filter, RefreshCw, ChevronDown, Check, X } from "lucide-react"; // Tambahkan icon X

export default function Toolbar({ query, onQuery, sort, onSort, onRefresh }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { id: "default", label: "Default" },
    { id: "asc", label: "Nama A-Z" },
    { id: "desc", label: "Nama Z-A" },
  ];

  const activeSortLabel = sortOptions.find((opt) => opt.id === sort)?.label;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex w-full items-center gap-2 md:w-auto md:gap-3">
      
      {/* Search Input dengan Custom Tombol X */}
      <div className="relative flex-1 md:w-auto">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text" // Diubah jadi "text" agar tidak tabrakan dengan "X" bawaan browser
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Cari nama atau email..."
          aria-label="Cari pengguna"
          // Tambahkan pr-10 (padding right) agar teks tidak menabrak ikon X
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm shadow-sm transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:ring-indigo-900 md:w-64"
        />
        
        {/* Tombol X Kustom yang hanya muncul jika ada teks pencarian */}
        {query && (
          <button
            onClick={() => onQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            aria-label="Hapus pencarian"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Custom Dropdown Filter */}
      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-3 text-sm text-slate-700 shadow-sm transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 min-w-[100px] md:min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline-block">{activeSortLabel}</span>
            <span className="sm:hidden">Filter</span>
          </div>
          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            {sortOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  onSort(opt.id);
                  setIsOpen(false);
                }}
                className={`cursor-pointer flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                  sort === opt.id
                    ? "bg-[#1A73E8] text-white font-medium" 
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                <span>{opt.label}</span>
                {sort === opt.id && <Check className="h-4 w-4" />} 
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <button
        onClick={onRefresh}
        aria-label="Muat ulang"
        className="cursor-pointer shrink-0 rounded-xl border border-slate-200 bg-white p-2.5 text-indigo-600 shadow-sm transition-all hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-slate-700"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
}