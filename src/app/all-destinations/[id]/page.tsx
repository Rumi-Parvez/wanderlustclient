import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DetailsActions } from "./DetailsActions";
import { BookNowButton } from "./BookNowButton";
import {
  LuArrowLeft,
  LuCheck,
  LuMapPin,
  LuStar,
  LuUserRound,
} from "react-icons/lu";

type Destination = {
  _id?: string;
  destinationName?: string;
  country?: string;
  category?: string;
  price?: string;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  description?: string;
};

const defaultOverview =
  "Discover the magic of Bali with pristine beaches, ancient temples, and vibrant culture. Experience luxury resorts, traditional landscapes, and unforgettable sunsets.";

const defaultHighlights = [
  "Luxury beachfront accommodation",
  "Unbeatable 1-yacht sunset",
  "Sunrise trek to Mount Batur",
  "Visit Ubud's iconic rice terraces",
  "Private beach + snorkel experiences",
];

type Props = { params: Promise<{ id: string }> };

export default async function DestinationDetailsPage({ params }: Props) {
  const { id } = await params;

  const apiUrl = process.env.NEXT_PUBLIC_SERVER;
  if (!apiUrl) {
    console.error("Please define NEXT_PUBLIC_SERVER in .env.local");
    notFound();
  }

  let data: Destination = {};
  try {
    const res = await fetch(`${apiUrl}/place/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) {
      notFound();
    }
    data = (await res.json()) as Destination;
  } catch (error) {
    console.error("Failed to load destination:", error);
    notFound();
  }

  const name = data.destinationName || "Bali Paradise";
  const country = data.country || "Indonesia";
  const category = data.category || "Beach";
  const price = Number(data.price) || 1299;
  const duration = data.duration || "7 Days / 6 Nights";
  const departureDate = data.departureDate || "08/15/2026";
  const description = data.description || defaultOverview;
  const imageUrl = data.imageUrl || "/images/CTA.png";

  return (
    <div className="bg-white px-6 pt-8 pb-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/all-destinations"
            className="flex items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-brand"
          >
            <LuArrowLeft className="size-4" />
            Back to Destinations
          </Link>
          <DetailsActions
            destination={{
              id,
              destinationName: name,
              country,
              category,
              price: String(price),
              duration,
              departureDate,
              imageUrl,
              description,
            }}
          />
        </div>

        <div className="mt-6 relative h-64 w-full overflow-hidden md:h-80">
          <Image
            src={imageUrl}
            alt={name}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <LuMapPin className="size-3.5" />
              {country}
              <span className="text-gray-300">·</span>
              {category}
            </p>

            <h1 className="mt-1.5 font-serif text-4xl text-gray-900">{name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5">
                <LuStar className="size-4 text-emerald-500" />
                <span className="font-semibold text-emerald-600">4.8</span>
                <span className="text-xs text-gray-500">(214 reviews)</span>
              </span>
              <span className="flex items-center gap-1.5 text-xs text-gray-600">
                <LuUserRound className="size-4 text-gray-400" />
                {duration}
              </span>
            </div>

            <h2 className="mt-8 text-lg font-semibold text-gray-900">
              Overview
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">
              {description}
            </p>

            <h2 className="mt-8 text-lg font-semibold text-gray-900">
              Highlights
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-500">
              {description}
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {defaultHighlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-2 text-xs text-gray-600"
                >
                  <LuCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit border border-gray-200 p-5 lg:sticky lg:top-24">
            <p className="text-xs text-gray-500">Starting from</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">${price}</p>
            <p className="mt-0.5 text-xs text-gray-400">Per person</p>

            <div className="mt-5">
              <p className="mb-1.5 text-xs font-medium text-gray-600">
                Departure
              </p>
              <div className="flex h-10 items-center rounded-[4px] bg-gray-100 px-3 text-sm text-gray-700">
                {departureDate}
              </div>
            </div>

            <BookNowButton
              destinationId={id}
              name={name}
              country={country}
              price={price}
              duration={duration}
              departureDate={departureDate}
              imageUrl={imageUrl}
            />

            <ul className="mt-5 space-y-2.5">
              {[
                "Free cancellation up to 7 Days",
                "Travel insurance included",
                "24/7 customer support",
              ].map((perk) => (
                <li
                  key={perk}
                  className="flex items-start gap-2 text-xs text-gray-600"
                >
                  <LuCheck className="mt-0.5 size-3.5 shrink-0 text-emerald-500" />
                  {perk}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
