# User Dashboard

Aplikasi Single Page Application (SPA) sederhana untuk menampilkan dan menjelajahi data pengguna dari [JSONPlaceholder](https://jsonplaceholder.typicode.com/users). Dibuat dengan React + Vite dan TailwindCSS, seluruh komponen UI dibuat sendiri tanpa template dashboard.

**Demo:** https://user-dashboard-seven-sigma.vercel.app/
## Fitur

- Daftar pengguna dalam bentuk grid card dengan pagination
- Pencarian berdasarkan nama atau email (client-side, dengan debounce)
- Urutkan nama A-Z / Z-A
- Detail pengguna (informasi pribadi, alamat, perusahaan) dalam panel samping di desktop dan modal di layar kecil
- State loading (spinner) dan error dengan pesan ramah serta tombol "Coba lagi"
- Mode gelap, preferensinya disimpan di `localStorage`

## Teknologi

React 19, Vite, TailwindCSS 4, lucide-react (ikon)

## Menjalankan Project

```bash
npm install
npm run dev      # development
npm run build    # build produksi
npm run preview  # preview hasil build
```

## Struktur Folder

```
src/
├── api/
│   └── users.js          # fungsi fetch ke API
├── hooks/
│   ├── useUsers.js       # fetching data + state loading/error/retry
│   └── useDebounce.js    # menunda nilai input pencarian
├── components/
│   ├── Toolbar.jsx       # search, sort, tombol refresh
│   ├── UserCard.jsx
│   ├── UserDetailPanel.jsx
│   ├── Pagination.jsx
│   ├── Spinner.jsx
│   ├── ErrorMessage.jsx
│   └── avatar.js         # helper inisial & warna avatar
├── App.jsx               # menyimpan state utama & menyusun halaman
├── main.jsx
└── index.css
```

---

## Jawaban Pertanyaan Pemahaman

### 1. State Management & Lifecycle

Data diambil di dalam custom hook `useUsers` menggunakan `fetch` yang dipanggil dari `useEffect`. Hook ini memegang tiga state, yaitu `users`, `loading`, dan `error`. Komponen `App` cukup memanggil `const { users, loading, error, retry } = useUsers()` dan menampilkan Spinner, ErrorMessage, atau daftar sesuai state tersebut. Karena aplikasinya kecil, saya tidak memakai library state management tambahan. `useState` dan `useMemo` sudah cukup.

**Mencegah memory leak.** Setiap kali effect berjalan, saya membuat `AbortController` dan mengirim `signal`-nya ke `fetch`. Pada fungsi cleanup effect, saya memanggil `controller.abort()`. Jika komponen di-unmount atau effect berjalan ulang saat request masih berlangsung, request lama dibatalkan sehingga tidak ada `setState` yang dipanggil setelah komponen hilang. Error bernama `AbortError` sengaja diabaikan di `catch` karena itu pembatalan yang disengaja, bukan kegagalan API. Di `finally`, `setLoading(false)` hanya dipanggil jika request belum di-abort.

Pola ini juga berguna di `React.StrictMode`. Pada mode development, React menjalankan effect dua kali (mount, cleanup, mount lagi). Request pertama dibatalkan oleh cleanup, sehingga hanya request kedua yang mengisi state.

**Mencegah infinite loop.** Dependency array effect hanya berisi `[attempt]`, sebuah counter yang naik hanya ketika pengguna menekan tombol "Coba lagi" atau "Muat ulang". Di dalam effect, `setUsers`, `setLoading`, dan `setError` tidak masuk ke dependency, dan state yang diubah di dalam effect tidak dipakai sebagai dependency-nya. Jadi perubahan state tidak memicu effect berjalan lagi. Jika dependency array dikosongkan atau berisi `users`, effect akan fetch, mengubah `users`, lalu fetch lagi, dan seterusnya.

### 2. Struktur Folder

Saya memisahkan file berdasarkan **tanggung jawabnya**:

- **`api/`** berisi kode yang berbicara dengan jaringan. Jika URL atau cara fetch berubah (misalnya menambah header atau ganti ke axios), cukup satu file yang diubah dan komponen tidak ikut terpengaruh.
- **`hooks/`** berisi logika yang tidak terkait tampilan. `useUsers` mengurus fetching dan `useDebounce` mengurus penundaan input. Dengan begini komponen tetap pendek dan logikanya bisa dipakai ulang.
- **`components/`** berisi bagian UI yang berdiri sendiri (kartu, toolbar, pagination, panel detail, spinner, pesan error). Tiap file punya satu tujuan sehingga mudah dibaca dan diubah. `avatar.js` adalah helper kecil yang dipakai dua komponen (`UserCard` dan `UserDetailPanel`), jadi saya letakkan di dekat pemakainya.
- **`App.jsx`** berperan sebagai container yang menyimpan state lintas komponen (`query`, `sort`, `page`, `selected`, `isDark`) dan menurunkannya lewat props. Komponen anak dibuat sebisa mungkin hanya menerima props dan menampilkan UI.

Untuk skala project ini struktur berbasis jenis file (`api`, `hooks`, `components`) sudah cukup jelas. Jika fiturnya bertambah banyak, saya akan beralih ke struktur per fitur (misalnya `features/users/`) agar file yang saling berkaitan tetap berdekatan.

### 3. Optimasi Kinerja (10.000 data user)

Beberapa hal sudah diterapkan di kode ini dan akan menjadi dasar penanganannya:

1. **Debounce (`useDebounce`, 300 ms).** Input tetap responsif karena nilai `query` langsung terisi saat mengetik, tetapi proses filter baru berjalan setelah pengguna berhenti mengetik sebentar. Jadi filter tidak dijalankan di setiap penekanan tombol.
2. **`useMemo` untuk filter dan sort.** Hasil `filtered` hanya dihitung ulang jika `users`, `debouncedQuery`, atau `sort` berubah. Render yang dipicu hal lain (misalnya membuka panel detail) tidak mengulang proses filter 10.000 data.
3. **Pagination.** Yang di-render ke DOM hanya 6 kartu per halaman, bukan 10.000. Biaya render tetap kecil berapa pun jumlah datanya.
4. **`React.memo` + `useCallback`.** `UserCard` dibungkus `memo` dan handler `onSelect` dibuat stabil dengan `useCallback`, sehingga kartu yang datanya tidak berubah tidak ikut di-render ulang.

Jika lag masih terasa dengan 10.000 data, langkah berikutnya:

- **`useDeferredValue` atau `useTransition`** untuk menandai proses filter sebagai pekerjaan berprioritas rendah. React akan mendahulukan update input yang mendesak, sehingga kolom pencarian tetap lancar walau filter masih berjalan.
- **Virtualisasi list** (`react-window` atau `@tanstack/react-virtual`) jika desainnya diganti menjadi satu daftar panjang tanpa pagination. Hanya item yang terlihat di layar yang di-render.
- **Menyiapkan indeks pencarian** satu kali saat data dimuat (misalnya menyimpan `name` dan `email` dalam huruf kecil), agar `toLowerCase()` tidak dipanggil ulang untuk 10.000 data di setiap pencarian.
- **Web Worker** bila proses filter sendiri sudah terlalu berat bagi main thread.
- **Pencarian dan pagination di sisi server** bila data terus bertambah, karena mengirim semua data ke browser tidak akan efisien.

---
