import { AuthMode } from "@/components/auth/auth-schemas";
import { toast } from "sonner";

type AuthError = {
  message?: string;
  status?: number;
};

const fallbackErrorMessage = "Something went wrong. Please try again.";

export function getAuthErrorMessage(error: unknown, mode: AuthMode): string {
  const authError = (error ?? {}) as AuthError;

  if (authError.message) {
    return authError.message;
  }

  if (mode === AuthMode.Login && authError.status === 401) {
    return "Invalid email or password.";
  }

  if (mode === AuthMode.Signup && authError.status === 409) {
    return "An account with this email already exists.";
  }

  if (authError.status === 403) {
    return "Please verify your email first.";
  }

  if (mode === AuthMode.ResetPassword && authError.status === 400) {
    return "Invalid or expired token.";
  }

  return fallbackErrorMessage;
}

export function showAuthSuccessToast(mode: AuthMode) {
  const messages: Record<AuthMode, string> = {
    [AuthMode.Login]: "Logged in successfully!",
    [AuthMode.Signup]:
      "Account created successfully! Please check your email if verification is required.",
    [AuthMode.ForgotPassword]:
      "Password reset link sent! Please check your email.",
    [AuthMode.ResetPassword]:
      "Password reset successfully! You can now sign in.",
  };

  toast.success(messages[mode], { position: "bottom-left" });
}

export function showAuthErrorToast(message: string) {
  toast.error(message, {
    position: "bottom-left",
    style: {
      border: "none",
      background: "#e11d48",
      color: "white",
      fontWeight: "400",
    },
  });
}
