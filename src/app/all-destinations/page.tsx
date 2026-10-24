"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const categoryOptions = [
  "Beach",
  "Mountain",
  "Nature",
  "Adventure",
  "City",
  "Honeymoon",
];

const priceRanges = [
  { label: "Under $2,500", min: 0, max: 2500 },
  { label: "$2,500 - $3,500", min: 2500, max: 3500 },
  { label: "Over $3,500", min: 3500, max: Infinity },
];

const sortOptions = [
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating: High to Low", value: "rating-desc" },
  { label: "Name: A to Z", value: "name-asc" },
];

const selectTriggerClasses =
  "h-10 w-full rounded-[4px] border-gray-200 px-4 text-xs font-medium tracking-wide text-gray-600 uppercase shadow-none aria-expanded:border-gray-300";

const optionTriggerClasses = "h-auto w-auto py-1 text-[11px]";

function DestinationCard({ item }: { item: Destination }) {
  const price = Number(item.price);
  const duration = Number(item.duration);

  return (
    <article className="border border-gray-200 bg-white">
      <Link
        href={`/all-destinations/${item._id}`}
        className="block"
        aria-label={`View ${item.destinationName}`}
      >
        <div className="relative h-56">
          <Image
            src={item.imageUrl}
            alt={item.destinationName || "Travel destination"}
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
            {item.country || item.category}
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

          <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
            <LuCalendarFold className="size-3.5" />
            {Number.isFinite(duration)
              ? `${duration} Days`
              : "Duration unavailable"}
          </p>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Link
          href="/my-bookings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand transition-colors hover:text-brand/80"
        >
          Book Now
          <LuArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  );
}

export default function AllDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    let cancelled = false;

    async function fetchDestinations() {
      try {
        if (!API_URL) {
          throw new Error(
            "API URL is missing. Check your .env.local file."
          );
        }

        const response = await fetch(`${API_URL}/place`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch destinations (${response.status}).`
          );
        }

        const data: unknown = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("API response must be an array.");
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
              : "Unable to load destinations."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDestinations();

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = destinations.filter((item) => {
    const matchesCategory =
      category === "all" || item.category === category;

    const price = Number(item.price);

    const selectedRange = priceRanges.find(
      (range) => range.label === priceRange
    );

    const matchesPrice =
      priceRange === "all" ||
      (selectedRange !== undefined &&
        Number.isFinite(price) &&
        price >= selectedRange.min &&
        price <= selectedRange.max);

    return matchesCategory && matchesPrice;
  });

  const sorted = [...filtered].sort((a, b) => {
    const priceA = Number(a.price);
    const priceB = Number(b.price);

    switch (sortBy) {
      case "price-asc":
        return priceA - priceB;

      case "price-desc":
        return priceB - priceA;

      case "rating-desc":
        return DEFAULT_RATING - DEFAULT_RATING;

      case "name-asc":
        return a.destinationName.localeCompare(b.destinationName);

      default:
        return 0;
    }
  });

  return (
    <div className="bg-white px-6 pt-10 pb-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-4xl text-gray-900">
          Explore All Destinations
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Find your perfect travel experience from our curated collection
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className={selectTriggerClasses}>
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                value="all"
                className={optionTriggerClasses}
              >
                All Categories
              </SelectItem>

              {categoryOptions.map((option) => (
                <SelectItem
                  key={option}
                  value={option}
                  className={optionTriggerClasses}
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className={selectTriggerClasses}>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem
                value="all"
                className={optionTriggerClasses}
              >
                All Prices
              </SelectItem>

              {priceRanges.map((range) => (
                <SelectItem
                  key={range.label}
                  value={range.label}
                  className={optionTriggerClasses}
                >
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className={selectTriggerClasses}>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>

            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={optionTriggerClasses}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 6, 5, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse border border-gray-200"
              >
                <div className="h-56 bg-gray-200" />
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
        ) : (
          <>
            <p className="mt-6 text-sm text-gray-500">
              Showing {sorted.length} of {destinations.length} destinations
            </p>

            {sorted.length === 0 ? (
              <div className="mt-10 border border-gray-200 bg-gray-50 py-16 text-center text-sm text-gray-500">
                No destinations match your filters.
              </div>
            ) : (
              <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sorted.map((item, index) => (
                  <DestinationCard
                    key={item._id || `${item.destinationName}-${index}`}
                    item={item}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}