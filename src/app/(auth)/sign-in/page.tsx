"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa6";
import { LuLock, LuMail } from "react-icons/lu";
import { toast } from "react-toastify";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const inputClasses =
  "h-10 rounded-[4px] border-0 bg-gray-100 px-4 pl-10 text-sm shadow-none";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const remembered = localStorage.getItem("rememberedEmail");
      if (remembered) {
        setForm((prev) => ({ ...prev, email: remembered }));
        setRememberMe(true);
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting) return;

    const apiUrl = process.env.NEXT_PUBLIC_SERVER;
    if (!apiUrl) {
      toast.error("Server URL is missing!");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          rememberMe,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Sign in failed (${res.status}): ${errorText}`);
      }

      if (rememberMe) {
        localStorage.setItem("rememberedEmail", form.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      toast.success("Signed in successfully! Welcome back.");
      router.push("/");
    } catch (error) {
      console.error("Sign in failed:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to sign in. Check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-[#f4f9fb] px-6 py-16">
      <div className="mx-auto max-w-md">
        <h1 className="text-center font-serif text-4xl text-gray-900">
          Welcome Back
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Resume your adventure with Wanderlust
        </p>

        <form
          className="mt-8 border border-gray-200 bg-white p-8 shadow-sm"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <div className="space-y-5">
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
                  onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
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
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() =>
                  toast.info("Password reset instructions coming soon.")
                }
                className="text-sm text-brand transition-colors hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="h-10 w-full rounded-md bg-brand text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:opacity-60"
            >
              Sign In
            </button>

            <p className="pt-1 text-center text-xs text-gray-500">
              Or continue with
            </p>

            <button
              type="button"
              onClick={() => toast.info("Google sign-in is coming soon.")}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
            >
              <FaGoogle className="size-4 text-gray-700" />
              Sign Up With Google
            </button>

            <p className="pt-1 text-center text-xs text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-brand hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
