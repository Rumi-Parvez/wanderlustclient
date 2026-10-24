"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa6";
import { LuLock, LuMail, LuUserRound } from "react-icons/lu";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";

const inputClasses =
  "h-10 rounded-[4px] border-0 bg-gray-100 px-4 pl-10 text-sm shadow-none";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

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
      toast.error("Password must be at least 8 characters.");
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_SERVER;
    if (!apiUrl) {
      toast.error("Server URL is missing!");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${apiUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Registration failed (${res.status}): ${errorText}`);
      }

      toast.success("Account created! Please sign in.");
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign up failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create account."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#f4f9fb] px-6 py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-center font-serif text-4xl text-gray-900">
          Create Account
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Start your adventure with Wanderlust
        </p>

        <form
          className="mt-8 border border-gray-200 bg-white p-8 shadow-sm"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <div className="space-y-5">
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
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="Enter your name"
                  className={inputClasses}
                />
              </div>
            </div>

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
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="Enter your email"
                  className={inputClasses}
                />
              </div>
            </div>

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
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Create a password"
                  className={inputClasses}
                />
              </div>
            </div>

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
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  className={inputClasses}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="h-10 w-full rounded-md bg-brand text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
            >
              Create Account
            </button>

            <p className="pt-1 text-center text-xs text-gray-500">
              Or sign up with
            </p>

            <button
              type="button"
              onClick={() => toast.info("Google sign-up is coming soon.")}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
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
