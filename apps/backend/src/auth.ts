// src/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";
import { db } from "./db/client";
import * as schema from "./schema/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: "http://localhost:4000",
  basePath: "/api/auth",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "change-this-in-production-to-a-long-random-string",

  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { ...schema },
  }),

  advanced: {
    disableOriginCheck: process.env.NODE_ENV !== "production",
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 3600,

    sendResetPassword: async ({ user, url, token }) => {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3001";
      const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

      void resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Reset your password",
        html: `
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link expires in 1 hour.</p>
        `,
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      console.log(user, url);

      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Verify your email address",
        html: `
          <h2>Welcome to Planora, hoe!</h2>
          <p>Click the link below to verify your email:</p>
          <a href="${url}" style="padding: 10px 20px; background: #000; color: white; text-decoration: none;">
            Verify Email
          </a>
          <p>If you didn't sign up, ignore this email.</p>
        `,
      });
    },
  },

  experimental: {
    joins: false,
  },
});
