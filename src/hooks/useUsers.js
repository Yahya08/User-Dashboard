import { useEffect, useState } from "react";
import { fetchUsers } from "../api/users";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchUsers(controller.signal)
      .then((data) => {
        // TRICK: Menggandakan 10 data dari API menjadi 40 data agar terlihat banyak
        let multipliedData = [];
        for (let i = 0; i < 4; i++) {
          multipliedData = [
            ...multipliedData,
            ...data.map((user) => ({
              ...user,
              id: user.id + i * 10, // Membuat ID unik (1-40)
              email: `u${i + 1}_${user.email}`, // Biar emailnya agak beda
            })),
          ];
        }
        setUsers(multipliedData);
      })
      .catch((err) => {
        if (err.name !== "AbortError") setError(err.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  return { users, loading, error, retry: () => setAttempt((n) => n + 1) };
}