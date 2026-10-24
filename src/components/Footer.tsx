"use client";

import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { LuArrowUpRight } from "react-icons/lu";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/all-destinations" },
  { label: "My Bookings", href: "/my-bookings" },
  { label: "My Profile", href: "/profile" },
];

const supportLinks = [
  { label: "Help Center", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-[#111111] px-6 pt-14 pb-6 text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-serif text-5xl md:text-6xl">Wanderlast</h2>
        <p className="mt-2 text-sm text-gray-400">
          Your gateway to extraordinary travel experiences around the world.
        </p>

        <div className="mt-12 grid gap-10 max-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-gray-200">
              Newsletter
            </h3>
            <p className="mt-3 text-xs text-gray-400">
              Subscribe for exclusive travel deals and inspiration.
            </p>
            <form
              className="mt-4 flex max-w-xs items-center bg-[#2b2b2b]"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter email"
                className="h-10 w-full bg-transparent px-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="mr-1 grid size-8 shrink-0 place-items-center bg-[#4a4a4a] text-white transition-colors hover:bg-brand"
              >
                <LuArrowUpRight className="size-4" />
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-gray-200">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-gray-200">
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-gray-200">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-400">
              <li>
                <a
                  href="tel:7869011622"
                  className="transition-colors hover:text-white"
                >
                  786 901 1622
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@wanderland.com"
                  className="transition-colors hover:text-white"
                >
                  info@wanderland.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-gray-500">
          <p>© 2026 Wanderlust. All rights reserved.</p>
          <div className="flex items-center gap-5 text-lg text-gray-300">
            <a href="#" aria-label="X" className="transition-colors hover:text-white">
              <FaXTwitter />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="transition-colors hover:text-white"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="transition-colors hover:text-white"
            >
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
