"use client";

import { useRouter } from "next/navigation";
import { LuArrowRight } from "react-icons/lu";
import { toast } from "react-toastify";
import { addBooking } from "@/lib/bookings";

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

  function handleBook() {
    try {
      addBooking({
        destinationId: props.destinationId,
        name: props.name,
        country: props.country,
        price: props.price,
        duration: props.duration,
        departureDate: props.departureDate,
        imageUrl: props.imageUrl,
      });
      toast.success(`${props.name} booked successfully!`);
      router.push("/my-bookings");
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Booking failed. Please try again.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleBook}
      className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-brand text-sm font-medium text-white transition-colors hover:bg-brand/90"
    >
      Book Now
      <LuArrowRight className="size-4" />
    </button>
  );
}
