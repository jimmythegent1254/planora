import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Required if your backend is on a different domain/port
  // e.g., http://localhost:3001 or https://api.yourdomain.com
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:5000",

  // Optional: if you changed the default basePath on the backend
  // basePath: "/api/auth", // default is usually "/api/auth"
});
