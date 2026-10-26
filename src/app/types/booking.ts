
export interface Booking {
  _id: string;
  bookingId: string;
  destinationId: string;
  name: string;
  country?: string;
  price: number;
  duration?: string;
  departureDate: string;
  imageUrl?: string;
  status?: string;
}

export interface ApiBooking {
  _id?: string;
  bookingId?: string;
  destinationId?: string;
  name?: string;
  country?: string;
  price?: number | string;
  duration?: string;
  bookingDate?: string;
  departureDate?: string;
  imageUrl?: string;
  status?: string;
}

export interface BookingsResponse {
  success?: boolean;
  message?: string;
  bookings?: ApiBooking[];
}
