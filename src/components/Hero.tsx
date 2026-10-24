import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const searchFields = [
  { label: "Location", placeholder: "Address, City Or Zip" },
  { label: "Date/Duration", placeholder: "Anytime/3 Days" },
  { label: "Budget", placeholder: "$0-$5000" },
  { label: "People", placeholder: "5-10" },
];

export function Hero() {
  return (
    <section className="relative flex h-[85vh] min-h-[600px] items-center justify-center">
      <Image
        src="/images/Banner.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 px-4 pb-24 text-center">
        <h1 className="font-serif text-5xl leading-[1.05] text-white md:text-7xl">
          Discover Your
          <br />
          Next Adventure
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/90 md:text-base">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/all-destinations"
            className="flex items-center gap-2 bg-blue-500/85 px-7 py-3 text-sm font-medium uppercase tracking-wide text-white "
          >
            Explore Now
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/all-destinations"
            className="bg-white/30 px-7 py-3 text-sm font-medium uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/40"
          >
            View Destination
          </Link>
        </div>
      </div>

      <div className="absolute  bottom-0 z-20 bg-white/30   text-sm font-medium uppercase tracking-wide text-white backdrop-blur-sm transition-colors hover:bg-white/40 w-full">
        <form className="grid grid-cols-2 md:grid-cols-5 ">
          {searchFields.map((field) => (
            <div
              key={field.label}
              className="px-6 py-2.5 max-md:border-t max-md:border-gray-200 md:border-l md:border-gray-200 md:first:border-l-0"
            >
              <label className="mb-0.5 block text-sm font-semibold text-white">
                {field.label}
              </label>
              <input
                type="text"
                placeholder={field.placeholder}
                className="w-full bg-transparent text-sm text-white placeholder:text-white focus:outline-none"
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-blue-500/80  text-xl font-medium text-white transition-colors  max-md:col-span-2 md:py-4"
          >
            Search
          </button>
        </form>
      </div>
    </section>
  );
}
