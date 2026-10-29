import { useState } from "react";
import {
  X, User, Mail, Phone, Globe, Building2, Briefcase, Link2, MapPin,
} from "lucide-react";
import { avatarColor, initials } from "./avatar";

const TABS = ["Informasi Pribadi", "Alamat", "Perusahaan"];

function Item({ icon: Icon, label, children }) {
  return (
    <div className="mb-5 flex gap-4">
      <Icon className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500 dark:text-indigo-400" />
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <div className="mt-1 break-words text-sm font-semibold text-slate-800 dark:text-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function UserDetailPanel({ user, onClose }) {
  const [tab, setTab] = useState(TABS[0]);
  const { address, company } = user;

  return (
    <div className="flex flex-col rounded-[32px] bg-white dark:bg-slate-900 p-6 shadow-xl ring-1 ring-slate-100 dark:ring-slate-800 sm:p-8 transition-colors duration-300">
      {/* Header Panel */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-extrabold ${avatarColor(user.id)}`}>
            {initials(user.name)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">{user.name}</h2>
            <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400">{user.email}</p>
            <div className="mt-2.5 flex gap-2">
              <span className="rounded-md bg-indigo-50 dark:bg-indigo-900/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                User
              </span>
              <span className="rounded-md bg-emerald-50 dark:bg-emerald-900/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Active
              </span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="cursor-pointer rounded-full bg-slate-50 dark:bg-slate-800 p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 transition-colors">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-8 flex gap-4 border-b border-slate-100 dark:border-slate-800 text-sm sm:gap-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`cursor-pointer -mb-px whitespace-nowrap pb-3 font-semibold transition-colors ${
              tab === t
                ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-b-2 border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Contents*/}
      <div className="mt-6">
        {tab === "Informasi Pribadi" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <Item icon={User} label="Nama Lengkap">{user.name}</Item>
            <Item icon={Mail} label="Email"><span className="text-indigo-600 dark:text-indigo-400">{user.email}</span></Item>
            <Item icon={Phone} label="Telepon">{user.phone.split(" x")[0]}</Item>
            <Item icon={Globe} label="Website">{user.website}</Item>
          </div>
        )}
        
        {tab === "Alamat" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <Item icon={MapPin} label="Jalan">
              {address?.street}, {address?.suite}
            </Item>
            <Item icon={MapPin} label="Kota & Kode Pos">
              {address?.city}, {address?.zipcode}
            </Item>
          </div>
        )}
        
        {tab === "Perusahaan" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <Item icon={Building2} label="Nama Perusahaan">
              {company?.name}
            </Item>
            <Item icon={Briefcase} label="Slogan">
              <span className="text-xs italic text-slate-500 font-normal">"{company?.catchPhrase}"</span>
            </Item>
            <Item icon={Link2} label="Website Perusahaan">
              <span className="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:underline">
                http://www.{company?.name.toLowerCase().replace(/[^a-z]/g, "")}.com
              </span>
            </Item>
          </div>
        )}
      </div>
      <button
        onClick={onClose}
        className="cursor-pointer mt-6 w-full rounded-xl bg-[#F4F6FF] dark:bg-indigo-900/30 py-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 transition-all duration-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600"
      >
        Tutup
      </button>
    </div>
  );
}