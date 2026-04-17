"use client";

import heroEvent from "@/assets/hero-event.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Redirect if no token is present
  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      router.push("/auth"); // or wherever your auth page is
    }
  }, [token, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: data.newPassword,
        token,
      });

      if (error) throw error;

      toast.success("Password reset successfully! You can now sign in.");

      // Redirect to sign-in page after success
      router.push("/auth");
    } catch (error: any) {
      console.error(error);
      let message = "Failed to reset password. Please try again.";

      if (error?.message) {
        message = error.message;
      } else if (error?.status === 400) {
        message = "Invalid or expired token.";
      }

      toast.error(message, {
        position: "bottom-left",
        style: {
          border: "none",
          background: "#e11d48",
          color: "white",
          fontWeight: "light",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">Invalid reset link. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center bg-gray-50">
      <div className="w-[55%] flex justify-center">
        <div className="w-[420px] flex flex-col gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-rose-600 text-white rounded-full p-2">
              <CalendarDays />
            </div>
            <span className="text-lg font-bold">Planora</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold">Reset your password</span>
            <p className="text-sm text-slate-500">
              Enter your new password below.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="py-5 pl-10 rounded-[15px] shadow-sm"
                    {...form.register("newPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
                {form.formState.errors.newPassword && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="py-5 pl-10 rounded-[15px] shadow-sm"
                    {...form.register("confirmPassword")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </Button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full p-6 bg-rose-600 mt-2 cursor-pointer hover:bg-rose-500 hover:shadow-md"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
                <ArrowRight />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => router.push("/sign-in")}
                className="text-sm text-slate-500 hover:text-rose-600 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side hero image (same as your auth page) */}
      <div className="relative h-screen w-[45%] hidden lg:block">
        <Image
          fill
          className="object-cover"
          src={heroEvent} // You'll need to import this or use a public image
          alt="Event Hero"
        />

        {/* Optional testimonial */}
        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 z-20 bg-stone-100 w-11/12 rounded-md p-5">
          <span className="font-bold text-slate-900">
            "Eventify made managing our 5,000-person conference effortless."
          </span>
          <div className="flex items-center gap-2 mt-2">
            <div className="h-10 w-10 rounded-full bg-slate-300"></div>
            <div className="flex flex-col">
              <h1 className="text-sm font-bold">Sarah Chen</h1>
              <span className="text-xs text-slate-500">
                Head of Events, TechCorp
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
