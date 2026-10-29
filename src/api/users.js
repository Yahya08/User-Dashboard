const URL = "https://jsonplaceholder.typicode.com/users";

export async function fetchUsers(signal) {
  const res = await fetch(URL, { signal });
  if (!res.ok) throw new Error(`Server mengembalikan status ${res.status}`);
  return res.json();
}