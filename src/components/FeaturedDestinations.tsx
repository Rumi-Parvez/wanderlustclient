"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

import {
  LuArrowRight,
  LuCalendarFold,
  LuMapPin,
  LuStar,
} from "react-icons/lu";

interface Destination {
  _id: string;
  destinationName: string;
  country: string;
  category: string;
  price: string | number;
  duration: string | number;
  departureDate: string;
  imageUrl: string;
  description: string;
}

const API_URL = process.env.NEXT_PUBLIC_SERVER;
const DEFAULT_RATING = 4.5;

export function FeaturedDestinations() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [selected, setSelected] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const fetchDestinations = async () => {
      try {
        if (!API_URL) {
          throw new Error(
            "API URL is missing. Please check your .env.local file."
          );
        }

        const response = await fetch(`${API_URL}/place`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch destinations. Status: ${response.status}`
          );
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid API response. Expected an array of destinations."
          );
        }

        if (!cancelled) {
          setDestinations(data as Destination[]);
        }
      } catch (err) {
        console.error("Failed to fetch destinations:", err);

        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading destinations."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDestinations();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelected(emblaApi.selectedScrollSnap());
    };

    const onScroll = () => {
      setProgress(emblaApi.scrollProgress());
    };

    onSelect();
    onScroll();

    emblaApi.on("select", onSelect);
    emblaApi.on("scroll", onScroll);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("scroll", onScroll);
    };
  }, [emblaApi, destinations.length]);

  return (
    <section className="bg-white px-6 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-serif text-3xl text-gray-900 md:text-4xl">
              Featured Destinations
            </h2>

            <p className="mt-2 text-xs text-gray-500">
              Handpicked travel experiences for the adventure seekers
            </p>
          </div>

          <Link
            href="/all-destinations"
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-brand px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-brand transition-colors hover:bg-brand hover:text-white"
          >
            All Destinations
            <LuArrowRight className="size-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse border border-gray-200"
              >
                <div className="h-64 bg-gray-200" />

                <div className="space-y-3 p-4">
                  <div className="h-3 w-1/3 rounded bg-gray-200" />
                  <div className="h-5 w-2/3 rounded bg-gray-200" />
                  <div className="h-3 w-1/2 rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-10 border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            <p>Unable to load destinations.</p>
            <p className="mt-2">{error}</p>
          </div>
        ) : destinations.length === 0 ? (
          <p className="mt-10 text-sm text-gray-500">
            No destinations are available right now.
          </p>
        ) : (
          <>
            <div className="mt-10 overflow-hidden" ref={emblaRef}>
              <div className="-ml-5 flex">
                {destinations.map((item, index) => {
                  const price = Number(item.price);
                  const duration = Number(item.duration);

                  return (
                    <div
                      key={
                        item._id ||
                        `${item.destinationName}-${index}`
                      }
                      className="min-w-0 shrink-0 basis-full pl-5 sm:basis-1/2 lg:basis-1/3"
                    >
                      <article className="h-full border border-gray-200 bg-white">
                        <Link
                          href={`/all-destinations/${item._id}`}
                          className="block"
                          aria-label={`View ${item.destinationName}`}
                        >
                          <div className="relative h-64">
                            <Image
                              src={item.imageUrl}
                              alt={
                                item.destinationName ||
                                "Travel destination"
                              }
                              fill
                              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              className="object-cover"
                            />

                            <span className="absolute right-3 top-3 flex items-center gap-1 bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-900">
                              {DEFAULT_RATING.toFixed(1)}
                              <LuStar className="size-3 fill-yellow-400 text-yellow-400" />
                            </span>
                          </div>

                          <div className="p-4">
                            <p className="flex items-center gap-1.5 text-xs text-gray-500">
                              <LuMapPin className="size-3.5" />
                              {item.category}
                            </p>

                            <div className="mt-2 flex items-baseline justify-between gap-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {item.destinationName}
                              </h3>

                              <p className="shrink-0">
                                <span className="text-[17px] font-bold text-gray-900">
                                  {Number.isFinite(price)
                                    ? `$${price.toFixed(2)}`
                                    : "Price unavailable"}
                                </span>

                                <span className="text-[10px] text-gray-400">
                                  {" "}/Person
                                </span>
                              </p>
                            </div>

                            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                              {item.country && (
                                <span className="flex items-center gap-1.5">
                                  <LuMapPin className="size-3.5" />
                                  {item.country}
                                </span>
                              )}

                              <span className="flex items-center gap-1.5">
                                <LuCalendarFold className="size-3.5" />
                                {Number.isFinite(duration)
                                  ? `${duration} days`
                                  : "Duration unavailable"}
                              </span>
                            </div>
                          </div>
                        </Link>

                        <div className="px-4 pb-4">
                          <Link
                            href="/all-destinations"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand transition-colors hover:text-brand/80"
                          >
                            Book Now
                            <LuArrowRight className="size-3.5" />
                          </Link>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <p className="shrink-0 text-sm text-gray-700">
                <span className="font-medium text-gray-900">
                  {selected + 1}
                </span>

                <span className="text-gray-400">
                  /{destinations.length}
                </span>
              </p>

              <div className="h-px flex-1 bg-gray-200">
                <div
                  className="h-full bg-brand"
                  style={{
                    width: `${Math.max(progress * 100, 5)}%`,
                  }}
                />
              </div>

              <div className="flex shrink-0 gap-3">
                <button
                  type="button"
                  aria-label="Previous destinations"
                  onClick={() => emblaApi?.scrollPrev()}
                  className="grid size-8 place-items-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:border-brand hover:text-brand"
                >
                  <LuArrowRight className="size-3.5 rotate-180" />
                </button>

                <button
                  type="button"
                  aria-label="Next destinations"
                  onClick={() => emblaApi?.scrollNext()}
                  className="grid size-8 place-items-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:border-brand hover:text-brand"
                >
                  <LuArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
