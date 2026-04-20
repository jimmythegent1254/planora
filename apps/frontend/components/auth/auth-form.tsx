"use client";

import {
  getAuthErrorMessage,
  showAuthSuccessToast,
} from "@/components/auth/auth-feedback";
import {
  EmailField,
  NameField,
  PasswordField,
} from "@/components/auth/auth-form-fields";
import {
  type AuthFormData,
  AuthMode,
  authDefaultValues,
  authSchemas,
  authTextByMode,
} from "@/components/auth/auth-schemas";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, MailCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

type AuthFormProps = {
  initialMode: AuthMode;
  resetToken?: string | null;
};

function hasEmail(
  data: AuthFormData,
): data is AuthFormData & { email: string } {
  return "email" in data;
}

function hasPassword(
  data: AuthFormData,
): data is AuthFormData & { password: string } {
  return "password" in data;
}

function hasName(data: AuthFormData): data is AuthFormData & { name: string } {
  return "name" in data;
}

function hasNewPassword(
  data: AuthFormData,
): data is AuthFormData & { newPassword: string } {
  return "newPassword" in data;
}

export default function AuthForm({ initialMode, resetToken }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const previousModeRef = useRef(mode);

  const currentSchema = useMemo(() => authSchemas[mode], [mode]);
  const canSwitchModes = mode !== AuthMode.ResetPassword;

  const form = useForm<AuthFormData>({
    resolver: zodResolver(currentSchema),
    defaultValues: authDefaultValues[mode] as AuthFormData,
  });

  const shouldAnimate = previousModeRef.current !== mode;

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    form.reset(authDefaultValues[mode] as AuthFormData);
    setErrorMessage(null);
    if (mode !== AuthMode.Login) {
      setInfoMessage(null);
    }
    setShowPassword(false);
    setShowConfirmPassword(false);
    previousModeRef.current = mode;
  }, [form, mode]);

  useEffect(() => {
    const focusFieldByMode: Record<AuthMode, "name" | "email" | "newPassword"> =
      {
        [AuthMode.Login]: "email",
        [AuthMode.Signup]: "name",
        [AuthMode.ForgotPassword]: "email",
        [AuthMode.ResetPassword]: "newPassword",
      };
    form.setFocus(focusFieldByMode[mode]);
  }, [form, mode]);

  const onSubmit = async (data: AuthFormData) => {
    if (mode === AuthMode.ResetPassword && !resetToken) {
      const message = "Invalid or missing reset token.";
      setErrorMessage(message);
      setInfoMessage(null);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setInfoMessage(null);

    try {
      switch (mode) {
        case AuthMode.ForgotPassword: {
          if (!hasEmail(data)) {
            throw new Error("Missing email.");
          }

          const { error } = await authClient.requestPasswordReset({
            email: data.email,
          });
          if (error) throw error;
          showAuthSuccessToast(mode);
          break;
        }
        case AuthMode.Login: {
          if (!hasEmail(data) || !hasPassword(data)) {
            throw new Error("Missing credentials.");
          }

          const { error } = await authClient.signIn.email({
            email: data.email,
            password: data.password,
            callbackURL: "/dashboard",
          });
          if (error) throw error;
          showAuthSuccessToast(mode);
          router.push("/dashboard");
          break;
        }
        case AuthMode.Signup: {
          if (!hasName(data) || !hasEmail(data) || !hasPassword(data)) {
            throw new Error("Missing account information.");
          }

          const { error } = await authClient.signUp.email({
            name: data.name,
            email: data.email,
            password: data.password,
            callbackURL: "http://localhost:3001/login",
          });
          if (error) throw error;
          setMode(AuthMode.Login);
          setInfoMessage(
            "Your account was created. Please verify your email before signing in.",
          );
          break;
        }
        case AuthMode.ResetPassword: {
          const token = resetToken;
          if (!token) {
            throw new Error("Invalid or missing reset token.");
          }
          if (!hasNewPassword(data)) {
            throw new Error("Missing new password.");
          }

          const { error } = await authClient.resetPassword({
            newPassword: data.newPassword,
            token,
          });
          if (error) throw error;
          showAuthSuccessToast(mode);
          router.push("/login");
          break;
        }
        default: {
          const exhaustiveMode: never = mode;
          throw new Error(`Unsupported auth mode: ${String(exhaustiveMode)}`);
        }
      }
    } catch (error: unknown) {
      const message = getAuthErrorMessage(error, mode);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  const text = authTextByMode[mode];

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{text.title}</h1>
        <p className="text-sm text-slate-500">{text.description}</p>
      </div>

      {infoMessage && (
        <div
          className="flex items-start gap-2 rounded-[15px] border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700 shadow-sm"
          role="status"
          aria-live="polite"
        >
          <MailCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{infoMessage}</p>
        </div>
      )}

      <motion.div
        key={mode}
        initial={shouldAnimate ? { opacity: 0, x: -10 } : false}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.2 }}
        className="flex w-full flex-col gap-5"
      >
        {canSwitchModes && (
          <>
            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-[15px] border border-slate-200 bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-100"
            >
              <Image
                src="/google.png"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
              />
              <span className="ml-1 font-semibold">Continue with Google</span>
            </Button>

            <div className="flex items-center gap-4">
              <div className="h-px w-full bg-slate-200" />
              <span className="text-xs text-slate-500">or</span>
              <div className="h-px w-full bg-slate-200" />
            </div>
          </>
        )}

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          aria-describedby={errorMessage ? "auth-form-error" : undefined}
        >
          {mode === AuthMode.Signup && (
            <NameField
              form={form}
              name="name"
              id="name"
              label="Full Name"
              placeholder="John Doe"
              autoComplete="name"
            />
          )}

          {(mode === AuthMode.Login ||
            mode === AuthMode.Signup ||
            mode === AuthMode.ForgotPassword) && (
            <EmailField
              form={form}
              name="email"
              id="email"
              label="Email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          )}

          {(mode === AuthMode.Login || mode === AuthMode.Signup) && (
            <PasswordField
              form={form}
              name="password"
              id="password"
              label="Password"
              placeholder="••••••••"
              autoComplete={
                mode === AuthMode.Login ? "current-password" : "new-password"
              }
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((prev) => !prev)}
            />
          )}

          {mode === AuthMode.ResetPassword && (
            <>
              <PasswordField
                form={form}
                name="newPassword"
                id="newPassword"
                label="New Password"
                placeholder="••••••••"
                autoComplete="new-password"
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword((prev) => !prev)}
              />
              <PasswordField
                form={form}
                name="confirmPassword"
                id="confirmPassword"
                label="Confirm New Password"
                placeholder="••••••••"
                autoComplete="new-password"
                showPassword={showConfirmPassword}
                onTogglePassword={() => setShowConfirmPassword((prev) => !prev)}
              />
            </>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-2 h-12 w-full rounded-[15px] bg-rose-600 hover:bg-rose-500 hover:shadow-md"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {text.submitLabel}
            <ArrowRight />
          </Button>

          {errorMessage && (
            <p
              id="auth-form-error"
              className="text-left text-sm text-rose-500"
              role="alert"
              aria-live="polite"
            >
              {errorMessage}
            </p>
          )}
        </form>

        <div className="mt-1 space-y-2 text-center text-sm text-slate-800">
          {mode === AuthMode.ForgotPassword && (
            <button
              type="button"
              onClick={() => setMode(AuthMode.Login)}
              className="text-sm text-slate-500 hover:text-rose-600 hover:underline"
            >
              Back to Sign In
            </button>
          )}

          {mode === AuthMode.Login && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-1">
                Don&apos;t have an account?
                <button
                  type="button"
                  onClick={() => setMode(AuthMode.Signup)}
                  className="font-semibold text-rose-600 hover:underline"
                >
                  Sign up
                </button>
              </div>
              <button
                type="button"
                onClick={() => setMode(AuthMode.ForgotPassword)}
                className="text-sm text-slate-500 hover:text-rose-600 hover:underline"
              >
                Forgot your password?
              </button>
            </div>
          )}

          {mode === AuthMode.Signup && (
            <div>
              Already have an account?
              <button
                type="button"
                onClick={() => setMode(AuthMode.Login)}
                className="ml-1 font-semibold text-rose-600 hover:underline"
              >
                Sign in
              </button>
            </div>
          )}

          {mode === AuthMode.ResetPassword && (
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-slate-500 hover:text-rose-600 hover:underline"
            >
              Back to Sign In
            </button>
          )}
        </div>
      </motion.div>
    </>
  );
}
