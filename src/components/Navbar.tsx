import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";

const links = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/all-destinations" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "Admin", href: "/add-new-travels" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white">
      <nav className="relative flex h-14 items-center justify-between px-6">
        <div className="hidden items-center gap-8 self-stretch md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center border-b-2 text-sm transition-colors ${
                link.label === "Home"
                  ? "border-brand text-brand"
                  : "border-transparent text-gray-800 hover:text-brand"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 max-md:left-6 max-md:translate-x-0"
        >
          <Image
            src="/images/Wanderlast.png"
            alt="Wanderlast"
            width={140}
            height={28}
            className="h-6 w-auto"
            priority
          />
        </Link>

        <div className="ml-auto flex items-center gap-6 md:ml-0">
          <Link
            href="/profile"
            className="flex items-center gap-1.5 text-sm text-gray-800 transition-colors hover:text-brand"
          >
            <User className="size-4" />
            Profile
          </Link>
          <Link
            href="/sign-in"
            className="hidden text-sm text-gray-800 transition-colors hover:text-brand sm:block"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="text-sm text-gray-800 transition-colors hover:text-brand"
          >
            Sign Up
          </Link>
        </div>
      </nav>
    </header>
  );
}
