export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
      <p className="font-medium text-red-700">Oops, data pengguna gagal dimuat.</p>
      <p className="mt-1 text-sm text-red-500">{message}</p>
      <button onClick={onRetry} className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700">
        Coba lagi
      </button>
    </div>
  );
}