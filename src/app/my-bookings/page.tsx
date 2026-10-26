"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";

import BookingCard from "../my-bookings/BookingCard";
import { authClient } from "@/lib/auth-client";

import type {
  ApiBooking,
  Booking,
  BookingsResponse,
} from "../types/booking";

export default function MyBookingsPage() {
  const { data: session, isPending: sessionLoading } =
    authClient.useSession();

  const router = useRouter();

  const email = session?.user?.email;
  const apiUrl = process.env.NEXT_PUBLIC_SERVER?.replace(/\/+$/, "");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;

    if (!email) {
      router.push("/sign-in");
      return;
    }

    let cancelled = false;

    async function fetchBookings() {
      try {
        // Keep state updates in the asynchronous operation.
        await Promise.resolve();

        if (!apiUrl) {
          throw new Error("Server URL is missing!");
        }

        const response = await fetch(
          `${apiUrl}/bookings/${email}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
            cache: "no-store",
          }
        );

        const contentType = response.headers.get("content-type") || "";
        const responseText = await response.text();

        if (!response.ok) {
          throw new Error(
            `Failed to fetch bookings (${response.status}): ${responseText.slice(0, 200)}`
          );
        }

        if (!contentType.includes("application/json")) {
          throw new Error(
            "Backend did not return JSON. Check your API route."
          );
        }

        const data: unknown = JSON.parse(responseText);

        let bookingList: ApiBooking[] = [];

        if (Array.isArray(data)) {
          bookingList = data as ApiBooking[];
        } else if (data && typeof data === "object") {
          const result = data as BookingsResponse;

          if (result.success === false) {
            throw new Error(
              result.message || "Failed to load bookings."
            );
          }

          if (Array.isArray(result.bookings)) {
            bookingList = result.bookings;
          }
        }

        const formattedBookings: Booking[] = bookingList
          .filter((item) => Boolean(item._id || item.bookingId))
          .map((item) => {
            const id = String(item._id ?? item.bookingId);

            return {
              _id: id,
              bookingId: String(item.bookingId ?? id),
              destinationId: String(item.destinationId ?? ""),
              name: item.name ?? "Unknown destination",
              country: item.country ?? "",
              price: Number(item.price ?? 0),
              duration: item.duration ?? "",
              departureDate: String(
                item.bookingDate ?? item.departureDate ?? ""
              ),
              imageUrl: item.imageUrl ?? "",
              status: item.status ?? "Confirmed",
            };
          });

        if (!cancelled) {
          setBookings(formattedBookings);
        }
      } catch (error) {
        console.error("Fetch bookings error:", error);

        if (!cancelled) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load your bookings."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchBookings();

    return () => {
      cancelled = true;
    };
  }, [sessionLoading, email, apiUrl, router]);

  function handleBookingDeleted(bookingId: string) {
    setBookings((previous) =>
      previous.filter((booking) => booking._id !== bookingId)
    );
  }

  if (sessionLoading || (loading && Boolean(email))) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <LuLoader className="size-8 animate-spin text-brand" />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-white">
        <LuLoader className="size-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-6 pt-10 pb-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-4xl text-gray-900">
          My Bookings
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Manage and view your upcoming travel plans for{" "}
          <span className="font-medium text-gray-800">{email}</span>
        </p>

        <div className="mt-8 space-y-4">
          {bookings.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 py-16 text-center text-sm text-gray-500">
              You have no bookings yet.{" "}
              <button
                type="button"
                onClick={() => router.push("/all-destinations")}
                className="cursor-pointer font-medium text-brand hover:underline"
              >
                Browse destinations
              </button>
            </div>
          ) : (
            bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onDeleted={handleBookingDeleted}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
