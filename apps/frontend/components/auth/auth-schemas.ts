import * as z from "zod";

export enum AuthMode {
  Login = "login",
  Signup = "signup",
  ForgotPassword = "forgot-password",
  ResetPassword = "reset-password",
}

const authFieldsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
});

export const authSchemas = {
  [AuthMode.Login]: authFieldsSchema.pick({
    email: true,
    password: true,
  }),
  [AuthMode.Signup]: authFieldsSchema.pick({
    name: true,
    email: true,
    password: true,
  }),
  [AuthMode.ForgotPassword]: authFieldsSchema.pick({
    email: true,
  }),
  [AuthMode.ResetPassword]: authFieldsSchema
    .pick({
      newPassword: true,
      confirmPassword: true,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
} as const;

export type AuthFormDataByMode = {
  [AuthMode.Login]: z.infer<(typeof authSchemas)[AuthMode.Login]>;
  [AuthMode.Signup]: z.infer<(typeof authSchemas)[AuthMode.Signup]>;
  [AuthMode.ForgotPassword]: z.infer<
    (typeof authSchemas)[AuthMode.ForgotPassword]
  >;
  [AuthMode.ResetPassword]: z.infer<
    (typeof authSchemas)[AuthMode.ResetPassword]
  >;
};

export type AuthFormData = AuthFormDataByMode[AuthMode];

export const authDefaultValues: {
  [K in AuthMode]: AuthFormDataByMode[K];
} = {
  [AuthMode.Login]: {
    email: "",
    password: "",
  },
  [AuthMode.Signup]: {
    name: "",
    email: "",
    password: "",
  },
  [AuthMode.ForgotPassword]: {
    email: "",
  },
  [AuthMode.ResetPassword]: {
    newPassword: "",
    confirmPassword: "",
  },
};

export const authTextByMode: Record<
  AuthMode,
  {
    title: string;
    description: string;
    submitLabel: string;
  }
> = {
  [AuthMode.Login]: {
    title: "Welcome back",
    description: "Sign in to manage your events and tickets.",
    submitLabel: "Sign In",
  },
  [AuthMode.Signup]: {
    title: "Create an account",
    description: "Start creating and discovering events today.",
    submitLabel: "Create Account",
  },
  [AuthMode.ForgotPassword]: {
    title: "Forgot your password?",
    description: "Enter your email and we'll send you a reset link.",
    submitLabel: "Send Reset Link",
  },
  [AuthMode.ResetPassword]: {
    title: "Reset your password",
    description: "Enter your new password below.",
    submitLabel: "Reset Password",
  },
};
