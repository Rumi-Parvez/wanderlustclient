"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa6";
import { 
  LuLock, 
  LuMail, 
  LuUserRound, 
  LuEye, 
  LuEyeOff, 
  LuLoader 
} from "react-icons/lu";
import { toast } from "react-toastify";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const inputClasses =
  "h-10 rounded-[4px] border-0 bg-gray-100 px-4 pl-10 pr-10 text-sm shadow-none disabled:opacity-60";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await authClient.signUp.email(
        {
          email: form.email,
          password: form.password,
          name: form.fullName,
          callbackURL: "/",
        },
        {
          onRequest: () => {
            setSubmitting(true);
          },
          onSuccess: () => {
            toast.success("Account created successfully!");
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to create account.");
            setSubmitting(false);
          },
        }
      );

      if (error) {
        toast.error(error.message || "Failed to create account.");
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Sign up failed:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  }

  async function handleGoogleSignUp() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google sign-up failed:", error);
      toast.error("Failed to sign up with Google.");
    }
  }

  return (
    <div className="bg-[#f4f9fb] px-6 py-16 min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-md w-full">
        <h1 className="text-center font-serif text-4xl text-gray-900">
          Create Account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Start your adventure with Wanderlust
        </p>

        <form
          className="mt-8 border border-gray-200 bg-white p-8 shadow-sm rounded-lg"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <div className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Full Name
              </label>
              <div className="relative">
                <LuUserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="fullName"
                  required
                  disabled={submitting}
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Enter your name"
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Email Address
              </label>
              <div className="relative">
                <LuMail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  required
                  type="email"
                  disabled={submitting}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="Enter your email"
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Password
              </label>
              <div className="relative">
                <LuLock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="password"
                  required
                  type={showPassword ? "text" : "password"}
                  disabled={submitting}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Create a password (min 8 chars)"
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? <LuEyeOff className="size-4" /> : <LuEye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-gray-900"
              >
                Confirm Password
              </label>
              <div className="relative">
                <LuLock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  disabled={submitting}
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  className={inputClasses}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <LuEyeOff className="size-4" /> : <LuEye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-brand text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:opacity-60 cursor-pointer"
            >
              {submitting && <LuLoader className="size-4 animate-spin" />}
              {submitting ? "Creating account..." : "Create Account"}
            </button>

            <p className="pt-1 text-center text-xs text-gray-500">
              Or sign up with
            </p>

            {/* Google OAuth Button */}
            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleGoogleSignUp()}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:opacity-60 cursor-pointer"
            >
              <FaGoogle className="size-4 text-gray-700" />
              Sign Up With Google
            </button>

            <p className="pt-1 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-medium text-brand hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}