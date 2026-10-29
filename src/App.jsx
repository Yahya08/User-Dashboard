import { useCallback, useMemo, useState, useEffect } from "react";
import { Users, RefreshCw, Moon, Sun, Mail, Building2, Phone, ChevronRight } from "lucide-react";
import { useUsers } from "./hooks/useUsers";
import { useDebounce } from "./hooks/useDebounce";
import Toolbar from "./components/Toolbar";
import UserCard from "./components/UserCard";
import UserDetailPanel from "./components/UserDetailPanel";
import Pagination from "./components/Pagination";
import Spinner from "./components/Spinner";
import ErrorMessage from "./components/ErrorMessage";

const PAGE_SIZE = 6;

export default function App() {
  const { users = [], loading, error, retry } = useUsers();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  
  // Mengambil preferensi dari localStorage saat pertama kali dimuat
  const [isDark, setIsDark] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true"; // akan bernilai true jika sebelumnya disimpan "true"
  });
  
  const debouncedQuery = useDebounce(query, 300);

  // Menerapkan class 'dark' dan menyimpan preferensi ke localStorage setiap kali isDark berubah
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem("darkMode", "false");
    }
  }, [isDark]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let list = q
      ? users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q)
        )
      : users;

    if (sort !== "default") {
      list = [...list].sort((a, b) =>
        sort === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }
    return list;
  }, [users, debouncedQuery, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalEmails = users.filter((u) => u.email).length;
    const uniqueCompanies = new Set(users.filter(u => u.company?.name).map((u) => u.company.name)).size;
    const totalPhones = users.filter((u) => u.phone).length;

    return [
      { id: 1, label: "Total Pengguna", value: totalUsers, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" },
      { id: 2, label: "Email Terdaftar", value: totalEmails, icon: Mail, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
      { id: 3, label: "Perusahaan", value: uniqueCompanies, icon: Building2, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" },
      { id: 4, label: "Kontak Aktif", value: totalPhones, icon: Phone, color: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/20" },
    ];
  }, [users]);

  const handleQuery = (v) => {
    setQuery(v);
    setPage(1);
  };

  const handleSort = (v) => {
    setSort(v);
    setPage(1);
  };

  const handleSelect = useCallback((u) => setSelected(u), []);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <div className="relative min-h-screen bg-[#F4F7FF] dark:bg-[#0B1120] font-sans text-slate-900 dark:text-white scroll-smooth transition-colors duration-300">
          
      {/* EFEK BACKGROUND SVG - BEDA WARNA UNTUK LIGHT DAN DARK */}
      <div className="pointer-events-none absolute right-0 top-0 z-0 w-full max-w-[1000px] overflow-hidden opacity-100">
        {isDark ? (
          // SVG Gelombang untuk Dark Mode (Warna Navy-Slate gelap)
          <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full">
            <path d="M800 0H0C0 0 250 150 300 350C350 550 600 600 800 600V0Z" fill="#0F172A" opacity="0.6"/>
            <path d="M800 0H200C200 0 350 100 400 250C450 400 650 450 800 450V0Z" fill="#1E293B" opacity="0.4"/>
            <path d="M800 0H400C400 0 500 80 550 180C600 280 750 300 800 300V0Z" fill="#334155" opacity="0.2"/>
          </svg>
        ) : (
          // SVG Gelombang untuk Light Mode (Biru-Lavender Terang)
          <svg viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full">
            <path d="M800 0H0C0 0 250 150 300 350C350 550 600 600 800 600V0Z" fill="#EFF4FF"/>
            <path d="M800 0H200C200 0 350 100 400 250C450 400 650 450 800 450V0Z" fill="#DCE5FF"/>
            <path d="M800 0H400C400 0 500 80 550 180C600 280 750 300 800 300V0Z" fill="#C9D5FF" fillOpacity="0.6"/>
          </svg>
        )}
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-100/60 dark:border-slate-800/40 bg-white/50 dark:bg-[#0B1120]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-[#5755FF]" />
            <span className="text-xl font-bold text-[#102348] dark:text-white">UserDash</span>
          </div>
          
          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle Dark Mode"
            className="cursor-pointer rounded-xl p-2 text-slate-400 shadow-sm transition-all duration-200 hover:scale-110 hover:bg-white hover:text-slate-700 active:scale-95 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-start gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
        <main className="min-w-0 flex-1 w-full">
          
          <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="mt-3 text-3xl font-extrabold text-[#102348] dark:text-white md:text-4xl">
                User <span className="text-[#5755FF] dark:text-indigo-400">Dashboard</span>
              </h1>
              <p className="mt-1.5 max-w-lg text-xs leading-relaxed text-slate-500 dark:text-slate-400 sm:text-sm">
                Kelola dan jelajahi data pengguna dengan mudah. Cari berdasarkan nama
                atau email untuk menemukan pengguna yang kamu cari.
              </p>
            </div>

            <div className="w-full shrink-0 md:w-auto overflow-visible">
              <Toolbar
                query={query}
                onQuery={handleQuery}
                sort={sort}
                onSort={handleSort}
                onRefresh={retry}
              />
            </div>
          </div>

          <div>
            {loading && <Spinner />}
            {error && <ErrorMessage message={error} onRetry={retry} />}

            {!loading && !error && (
              <>
                <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
                  {stats.map((stat) => (
                    <div key={stat.id} className="flex flex-col rounded-2xl border border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm p-4 shadow-sm transition-all hover:shadow-md">
                      <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-full ${stat.bg} ${stat.color}`}>
                        <stat.icon className="h-4 w-4" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
                      <p className="mt-1 text-[11px] sm:text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
                {filtered.length === 0 ? (
                  <div className="mt-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-12 text-center text-sm text-slate-500">
                    Tidak ada pengguna yang cocok dengan pencarianmu.
                  </div>
                ) : (
                  <div
                    className={`mt-4 grid gap-5 ${
                      selected
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2" 
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
                    }`}
                  >
                    {visible.map((u) => (
                      <UserCard
                        key={u.id}
                        user={u}
                        active={selected?.id === u.id}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                )}

                {filtered.length > 0 && (
                  <div className="mt-8 flex flex-col gap-4 border-t border-slate-200/60 dark:border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <RefreshCw className="h-3.5 w-3.5 text-[#5755FF]" />
                      Menampilkan {start + 1}-{Math.min(start + visible.length, filtered.length)} dari {filtered.length} pengguna
                    </p>
                    <Pagination
                      page={safePage}
                      totalPages={totalPages}
                      onChange={setPage}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </main>

        {selected && (
          <aside className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:sticky lg:top-[132px] lg:block lg:w-[380px] lg:shrink-0 lg:p-0">
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm lg:hidden"
              onClick={handleClose}
            />
            
            <div className="relative z-10 w-full max-w-md lg:max-w-none">
              <UserDetailPanel
                key={selected.id}
                user={selected}
                onClose={handleClose}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}