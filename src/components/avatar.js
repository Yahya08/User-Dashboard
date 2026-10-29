const COLORS = [
  "bg-indigo-100 text-indigo-600",
  "bg-emerald-100 text-emerald-600",
  "bg-pink-100 text-pink-600",
  "bg-orange-100 text-orange-600",
  "bg-sky-100 text-sky-600",
  "bg-purple-100 text-purple-600",
];

export const avatarColor = (id) => COLORS[id % COLORS.length];

export const initials = (name) =>
  name
    .replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();