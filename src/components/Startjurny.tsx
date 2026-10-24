import Image from "next/image";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

export function Startjurny() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden px-6 py-24 text-center">
      <Image
        src="/images/CTA.png"
        alt=""
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-2xl">
        <h2 className="font-serif text-3xl text-white md:text-4xl">
          Ready To Start Your Journey?
        </h2>
        <p className="mt-3 text-xs text-gray-300">
          Join thousands of travelers who have discovered the world with
          Wanderlast
        </p>
        <Link
          href="/all-destinations"
          className="mt-8 inline-flex items-center gap-2 bg-white px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-900 transition-colors hover:bg-gray-100"
        >
          Book Your Trip Now
          <LuArrowRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
