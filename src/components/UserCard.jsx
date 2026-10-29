import { memo } from "react";
import { Mail, Phone, Building2, ArrowRight, MoreVertical } from "lucide-react";
import { avatarColor, initials } from "./avatar";

function UserCard({ user, active, onSelect }) {
  if (!user) return null;

  return (
    <div
      className={`relative rounded-3xl p-5 transition-all duration-300 font-['Plus_Jakarta_Sans',sans-serif] ${
        active
          ? "bg-white dark:bg-slate-800 border-2 border-indigo-500 ring-4 ring-indigo-500/10 shadow-lg shadow-indigo-500/10"
          : "bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/60 hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:shadow-md"
      }`}
    >
      

      {/* Profil Pengguna: Avatar + Detail Kontak */}
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-base font-bold ${avatarColor(
            user?.id || 1
          )}`}
        >
          {initials(user?.name || "")}
        </div>

        <div className="min-w-0 flex-1 space-y-1 pr-6">
          <h3 className="truncate text-base font-bold text-slate-900 dark:text-white">
            {user?.name || "-"}
          </h3>
          <p className="flex items-center gap-2 truncate text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Mail className="h-3.5 w-3.5 shrink-0" /> {user?.email || "-"}
          </p>
          <p className="flex items-center gap-2 truncate text-xs text-slate-500 dark:text-slate-400">
            <Phone className="h-3.5 w-3.5 shrink-0 text-indigo-500 dark:text-indigo-400" />
            {user?.phone ? user.phone.split(" x")[0] : "-"}
          </p>
        </div>
      </div>

      {/* Bagian Perusahaan (Sejajar Presisi dengan Teks Kontak) */}
      <div className="mt-4 flex items-center gap-3 ml-[72px]">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 dark:text-indigo-400 shrink-0">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            COMPANY
          </p>
          <p className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
            {user?.company?.name || "-"}
          </p>
        </div>
      </div>

      {/* Tombol Lihat Detail (Hover Biru Solid + Kursor Hand) */}
      {/* Tombol Opsi Titik Tiga */}
      <button
        onClick={() => onSelect(user)}
        className={`mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all duration-300 ${
          active
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
            : "bg-[#F4F6FF] text-indigo-600 hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-500/30"
        }`}
      >
        Lihat Detail <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default memo(UserCard);