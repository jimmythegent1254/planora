"use client";

import AuthForm from "@/components/auth/auth-form";
import { AuthMode } from "@/components/auth/auth-schemas";
import AuthWrapper from "@/components/auth/auth-wrapper";

export default function AuthPage() {
  return (
    <AuthWrapper>
      <AuthForm initialMode={AuthMode.Login} />
    </AuthWrapper>
  );
}
