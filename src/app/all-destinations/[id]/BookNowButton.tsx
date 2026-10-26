"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuArrowRight, LuLoader } from "react-icons/lu";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";

type BookNowButtonProps = {
  destinationId: string;
  name: string;
  country: string;
  price: number;
  duration: string;
  departureDate: string;
  imageUrl: string;
};

export function BookNowButton(props: BookNowButtonProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [submitting, setSubmitting] = useState(false);

  async function handleBook() {
    // Check if the user is logged in
    if (!session?.user) {
      toast.error("Please sign in to book a destination.");
      router.push("/sign-in");
      return;
    }

    const serverUrl = process.env.NEXT_PUBLIC_SERVER;

    if (!serverUrl) {
      toast.error("Backend server URL is not configured.");
      console.error("NEXT_PUBLIC_SERVER is missing in .env.local");
      return;
    }

    setSubmitting(true);


    const AllData = {
          // User Details
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,

          // Destination Details
          destinationId: props.destinationId,
          name: props.name,
          country: props.country,
          price: props.price,
          duration: props.duration,
          imageUrl: props.imageUrl,

          // Booking Details
          bookingDate: props.departureDate,
          bookingtime: new Date().toISOString(),
        }
    try {
      const res = await fetch(`${serverUrl}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(AllData),
      });

      // Read the response as text first
      const responseText = await res.text();

      // Safely parse the response as JSON
      let data: { message?: string; [key: string]: unknown };

      try {
        data = JSON.parse(responseText);
      } catch {
        console.error("Invalid backend response:", responseText);

        throw new Error(
          "Backend returned an invalid response. Please check your API URL and backend route."
        );
      }

      if (!res.ok) {
        throw new Error(data.message || "Booking failed.");
      }

      toast.success(`${props.name} booked successfully!`);
      router.push("/my-bookings");
    } catch (error) {
      console.error("Booking failed:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Booking failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleBook()}
      disabled={submitting}
      className="mt-5 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-brand text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {submitting ? (
        <>
          <LuLoader className="size-4 animate-spin" />
          Booking...
        </>
      ) : (
        <>
          Book Now
          <LuArrowRight className="size-4" />
        </>
      )}
    </button>
  );
}