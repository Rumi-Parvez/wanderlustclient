export type BookingStatus = "Confirmed" | "Pending";

export type Booking = {
  bookingId: string;
  destinationId: string;
  name: string;
  country: string;
  price: number;
  duration: string;
  departureDate: string;
  imageUrl: string;
  status: BookingStatus;
};

const STORAGE_KEY = "bookings";

export function getBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    return [];
  }
}

function saveBookings(bookings: Booking[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
}

export function addBooking(
  input: Omit<Booking, "bookingId" | "status">
): Booking {
  const booking: Booking = {
    ...input,
    bookingId: `BK-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    status: "Confirmed",
  };
  saveBookings([...getBookings(), booking]);
  return booking;
}

export function cancelBooking(bookingId: string) {
  saveBookings(getBookings().filter((b) => b.bookingId !== bookingId));
}

export function seedBookingsIfEmpty(samples: Booking[]) {
  const bookings = getBookings();
  try {
    const seeded = localStorage.getItem("bookingsSeeded");
    if (!bookings.length && !seeded) {
      saveBookings(samples);
      localStorage.setItem("bookingsSeeded", "true");
    }
  } catch {
    // localStorage unavailable (e.g., private mode) — ignore
  }
}

export function formatDeparture(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
