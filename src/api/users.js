const URL = "https://jsonplaceholder.typicode.com/users";

export async function fetchUsers(signal) {
    const res = await fetch(`${URL}?t=${Date.now()}`, {
    signal,
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
    },
    cache: "no-store", 
  });

  if (!res.ok) throw new Error(`Server mengembalikan status ${res.status}`);
  return res.json();
}