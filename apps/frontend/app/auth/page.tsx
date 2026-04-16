"use client";

import heroEvent from "@/assets/hero-event.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const endpoint = isLogin
        ? "http://localhost:5000/auth/sign-in/email"
        : "http://localhost:5000/auth/sign-up/email";

      const payload = isLogin
        ? { email: data.email, password: data.password }
        : { email: data.email, password: data.password, name: data.name };

      const response = await axios.post(endpoint, payload, {
        withCredentials: true, // Important: sends and receives HttpOnly cookies
        headers: { "Content-Type": "application/json" },
      });

      console.log(response);

      // Redirect to dashboard or home after successful auth
      router.push("/dashboard");
    } catch (error: unknown) {
      let message = "Something went wrong. Please try again.";

      if (typeof error === "object" && error !== null) {
        const err = error as {
          response?: {
            data?: {
              message?: string;
              error?: string;
            };
          };
        };

        console.log(err);

        message =
          err.response?.data?.message || err.response?.data?.error || message;
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

  return (
    <div className="min-h-screen flex items-center bg-gray-50 m-0">
      <div className="w-[55%] flex justify-center">
        <div className="w-100 flex flex-col gap-6">
          <div className="flex items-center gap-2 w-full">
            <div className="bg-rose-600 text-white rounded-full p-2">
              <CalendarDays />
            </div>
            <span className="text-lg font-bold">Planora</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-2xl font-bold">
              {isLogin ? "Welcome back" : "Create an account"}
            </span>
            <div className="text-sm text-slate-500">
              {isLogin
                ? "Sign in to manage your events and tickets."
                : "Start creating and discovering events today."}
            </div>
          </div>

          <motion.div
            key={isLogin ? "register" : "login"}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col w-full gap-4"
          >
            <div>
              <Button className="border border-slate-200 w-full bg-white p-5 cursor-pointer text-slate-700 hover:bg-slate-100 hover:border-slate-200">
                <Image src="/google.png" alt="Google" width={20} height={20} />
                <span className="font-semibold ml-1">Continue with Google</span>
              </Button>
            </div>

            <div className="flex items-start w-full gap-4">
              <div className="h-2 border-b border-slate-200 w-full"></div>
              <span className="text-xs text-slate-500">or</span>
              <div className="h-2 border-b border-slate-200 w-full"></div>
            </div>

            <div>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        className="py-5 pl-10 rounded-[15px] shadow-sm"
                        {...form.register("name")}
                      />
                    </div>
                    {form.formState.errors.name && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="py-5 pl-10 rounded-[15px] shadow-sm"
                      {...form.register("email")}
                    />
                  </div>

                  {form.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="py-5 pl-10 rounded-[15px] shadow-sm"
                      {...form.register("password")}
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
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full p-6 bg-rose-600 mt-2 cursor-pointer hover:bg-rose-500 hover:shadow-md"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight />
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-slate-800">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    form.reset();
                  }}
                  className="cursor-pointer hover:underline text-rose-600 font-semibold"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <div className="relative h-screen w-[45%] m-0">
        <Image fill className="object-cover" src={heroEvent} alt="Event Hero" />

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
