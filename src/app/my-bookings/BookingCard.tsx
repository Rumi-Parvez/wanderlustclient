"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  LuClock,
  LuEye,
  LuTrash2,
  LuLoader,
} from "react-icons/lu";
import { toast } from "react-toastify";

import { formatDeparture } from "@/lib/bookings";
import type { Booking } from "../types/booking";

interface BookingCardProps {
  booking: Booking;
  onDeleted: (bookingId: string) => void;
}

export default function BookingCard({
  booking,
  onDeleted,
}: BookingCardProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const apiUrl = process.env.NEXT_PUBLIC_SERVER?.replace(/\/+$/, "");

    if (!apiUrl) {
      toast.error("Server URL is missing!");
      return;
    }

    if (!booking._id || deleting) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to cancel "${booking.name}"?`
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const response = await fetch(
        `${apiUrl}/bookings/${booking._id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const contentType = response.headers.get("content-type") || "";
      const responseText = await response.text();

      let result: {
        success?: boolean;
        message?: string;
      } = {};

      if (contentType.includes("application/json") && responseText) {
        result = JSON.parse(responseText);
      }

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message ||
            `Failed to cancel booking (${response.status}).`
        );
      }

      onDeleted(booking._id);
      toast.success("Booking cancelled successfully!");
    } catch (error) {
      console.error("Delete booking error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to cancel booking. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  }

  const status = booking.status || "Confirmed";

  return (
    <div className="flex items-center gap-5 rounded-lg border border-gray-200 bg-white p-4 shadow-xs max-md:flex-col md:pl-4">
      <div className="relative h-28 w-48 shrink-0 overflow-hidden rounded-md bg-gray-100 max-md:w-full">
        <Image
          src={booking.imageUrl || "/images/CTA.png"}
          alt={booking.name || "Destination"}
          fill
          sizes="(max-width: 768px) 100vw, 192px"
          unoptimized
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
            status === "Confirmed"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600"
          }`}
        >
          <LuClock className="size-3" />
          {status}
        </span>

        <h3 className="mt-1.5 text-lg font-semibold text-gray-900">
          {booking.name}
        </h3>

        <p className="mt-1.5 text-xs text-gray-500">
          Departure:{" "}
          {booking.departureDate
            ? formatDeparture(booking.departureDate)
            : "Not specified"}
        </p>

        <p className="mt-0.5 break-all text-xs text-gray-500">
          Booking ID: {booking.bookingId}
        </p>

        <p className="mt-2 text-xl font-bold text-gray-900">
          ${booking.price}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3 max-md:w-full md:self-start">
        <button
          type="button"
          disabled={deleting}
          onClick={() => void handleDelete()}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-red-300 bg-white px-3 text-xs font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? (
            <LuLoader className="size-3.5 animate-spin" />
          ) : (
            <LuTrash2 className="size-3.5" />
          )}

          {deleting ? "Deleting..." : "Cancel"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.push(
              `/all-destinations/${encodeURIComponent(
                booking.destinationId
              )}`
            )
          }
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-sky-200 bg-white px-3 text-xs font-medium text-sky-600 transition-colors hover:bg-sky-50"
        >
          <LuEye className="size-3.5" />
          View
        </button>
      </div>
    </div>
  );
}
