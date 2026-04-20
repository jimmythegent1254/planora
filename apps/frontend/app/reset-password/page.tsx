"use client";

import AuthForm from "@/components/auth/auth-form";
import { AuthMode } from "@/components/auth/auth-schemas";
import AuthWrapper from "@/components/auth/auth-wrapper";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Redirect if no token is present
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.push("/login");
    }
  }, [token, router]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">Invalid reset link. Redirecting...</p>
      </div>
    );
  }

  return (
    <AuthWrapper>
      <AuthForm initialMode={AuthMode.ResetPassword} resetToken={token} />
    </AuthWrapper>
  );
}
