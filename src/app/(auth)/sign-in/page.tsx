"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa6";
import { 
  LuLock, 
  LuMail, 
  LuEye, 
  LuEyeOff, 
  LuLoader 
} from "react-icons/lu";
import { toast } from "react-toastify";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const inputClasses =
  "h-10 rounded-[4px] border-0 bg-gray-100 px-4 pl-10 pr-10 text-sm shadow-none disabled:opacity-60";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

    setSubmitting(true);

    try {
      const { error } = await authClient.signIn.email(
        {
          email: form.email,
          password: form.password,
          rememberMe,
          callbackURL: "/",
        },
        {
          onRequest: () => {
            setSubmitting(true);
          },
          onSuccess: () => {
            if (rememberMe) {
              localStorage.setItem("rememberedEmail", form.email);
            } else {
              localStorage.removeItem("rememberedEmail");
            }
            toast.success("Signed in successfully! Welcome back.");
            router.push("/");
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || "Failed to sign in. Check your credentials.");
            setSubmitting(false);
          },
        }
      );

      if (error) {
        toast.error(error.message || "Failed to sign in.");
        setSubmitting(false);
      }
    } catch (error) {
      console.error("Sign in failed:", error);
      toast.error("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Failed to sign in with Google.");
    }
  }

  return (
    <div className="bg-[#f4f9fb] px-6 py-16 min-h-screen flex items-center justify-center">
      <div className="mx-auto max-w-md w-full">
        <h1 className="text-center font-serif text-4xl text-gray-900">
          Welcome Back
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Resume your adventure with Wanderlust
        </p>

        <form
          className="mt-8 border border-gray-200 bg-white p-8 shadow-sm rounded-lg"
          onSubmit={(event) => void handleSubmit(event)}
        >
          <div className="space-y-5">
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
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
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
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Enter your password"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  disabled={submitting}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-brand text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:opacity-60 cursor-pointer"
            >
              {submitting && <LuLoader className="size-4 animate-spin" />}
              {submitting ? "Signing in..." : "Sign In"}
            </button>

            <p className="pt-1 text-center text-xs text-gray-500">
              Or continue with
            </p>

            {/* Google OAuth Button */}
            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleGoogleSignIn()}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 disabled:opacity-60 cursor-pointer"
            >
              <FaGoogle className="size-4 text-gray-700" />
              Sign In With Google
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