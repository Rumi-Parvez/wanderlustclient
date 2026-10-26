"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, LogOut, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";

const links = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/all-destinations" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "Admin", href: "/admin" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/sign-in");
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out. Please try again.");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Navigation Links */}
        <div className="hidden items-center gap-8 self-stretch md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`flex items-center border-b-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-brand text-brand"
                    : "border-transparent text-gray-700 hover:text-brand"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Brand Logo */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 max-md:left-6 max-md:translate-x-0"
        >
          <Image
            src="/images/Wanderlast.png"
            alt="Wanderlust"
            width={130}
            height={26}
            className="h-6 w-auto object-contain"
            priority
          />
        </Link>

        {/* Right Side User / Auth Actions */}
        <div className="ml-auto flex items-center gap-4 md:ml-0">
          {isPending ? (
            <div className="h-9 w-24 animate-pulse rounded-full bg-gray-100" />
          ) : session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-white py-1.5 pl-1.5 pr-3 shadow-xs transition-all hover:bg-gray-50 focus:outline-none cursor-pointer"
              >
                {session.user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User Avatar"}
                    className="size-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="flex size-8 items-center justify-center rounded-full bg-brand/10 font-semibold text-brand text-xs">
                    {session.user.name?.[0]?.toUpperCase() || <User className="size-4" />}
                  </div>
                )}
                <span className="max-w-[110px] truncate text-xs font-medium text-gray-800 hidden sm:inline">
                  {session.user.name}
                </span>
                <ChevronDown className="size-3.5 text-gray-400" />
              </button>

              {/* User Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white py-2 shadow-xl ring-1 ring-black/5 focus:outline-none z-50">
                  <div className="border-b border-gray-100 px-4 py-2.5">
                    <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {session.user.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="size-4 text-gray-400" />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      void handleLogout();
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-4 text-red-500" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/sign-in"
                className="text-sm font-medium text-gray-700 transition-colors hover:text-brand"
              >
                Login
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-brand/90"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}