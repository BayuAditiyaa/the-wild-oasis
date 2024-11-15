import { useQuery } from "@tanstack/react-query";
import { getBooking } from "../../services/apiBookings";
import { useParams } from "react-router-dom";

export function useBookingDetail() {
  const { bookingId } = useParams();

  const { isLoading, data, error } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBooking(bookingId),
  });

  return { isLoading, data, error };
}
