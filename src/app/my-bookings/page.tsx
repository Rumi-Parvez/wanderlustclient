"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LuClock, LuEye, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";

import {
  cancelBooking,
  formatDeparture,
  getBookings,
  type Booking,
} from "@/lib/bookings";



export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {

    const frame = requestAnimationFrame(() => {
      setBookings(getBookings());
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function handleCancel(bookingId: string) {
    if (!window.confirm("Cancel this booking?")) return;
    cancelBooking(bookingId);
    setBookings(getBookings());
    toast.error("Booking cancelled!");
  }

  return (
    <div className="bg-white px-6 pt-10 pb-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-serif text-4xl text-gray-900">My Bookings</h1>
        <p className="mt-2 text-sm text-gray-500">
          Manage and view your upcoming travel plans
        </p>

        <div className="mt-8 space-y-4">
          {bookings?.length === 0 && (
            <div className="border border-gray-200 bg-gray-50 py-16 text-center text-sm text-gray-500">
              You have no bookings yet.{" "}
              <button
                type="button"
                onClick={() => router.push("/all-destinations")}
                className="font-medium text-brand hover:underline"
              >
                Browse destinations
              </button>
            </div>
          )}

          {bookings?.map((booking) => (
            <div
              key={booking.bookingId}
              className="flex items-center gap-5 border border-gray-200 bg-white p-4 max-md:flex-col md:pl-4"
            >
              <div className="relative h-28 w-48 shrink-0 max-md:w-full">
                <Image
                  src={booking.imageUrl || "/images/CTA.png"}
                  alt={booking.name}
                  fill
                  sizes="192px"
                  unoptimized
                  className="object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    booking.status === "Confirmed"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-amber-50 text-amber-600"
                  }`}
                >
                  {booking.status === "Confirmed" ? (
                    <LuClock className="size-3" />
                  ) : (
                    <LuClock className="size-3" />
                  )}
                  {booking.status}
                </span>

                <h3 className="mt-1.5 text-lg font-semibold text-gray-900">
                  {booking.name}
                </h3>

                <p className="mt-1.5 text-xs text-gray-500">
                  Departure: {formatDeparture(booking.departureDate)}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Booking ID: {booking.bookingId}
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  ${booking.price}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 max-md:w-full md:self-start">
                <button
                  type="button"
                  onClick={() => handleCancel(booking.bookingId)}
                  className="flex h-8 items-center gap-1.5 rounded-md border border-red-300 bg-white px-3 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
                >
                  <LuTrash2 className="size-3.5" />
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/all-destinations/${booking.destinationId}`)
                  }
                  className="flex h-8 items-center gap-1.5 rounded-md border border-sky-200 bg-white px-3 text-xs font-medium text-sky-600 transition-colors hover:bg-sky-50"
                >
                  <LuEye className="size-3.5" />
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
