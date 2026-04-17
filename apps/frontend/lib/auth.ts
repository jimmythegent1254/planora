import { cookies } from "next/headers";

export async function getUser() {
  const cookieStore = await cookies(); // ✅ IMPORTANT FIX

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const res = await fetch("http://localhost:5000/auth/me", {
    headers: {
      Cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.user;
}
