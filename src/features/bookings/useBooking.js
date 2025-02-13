import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBooking } from "../../services/apiBookings";

// Hook personalizat care preia datele pentru o rezervare specifică pe baza bookingId din URL
export function useBooking() {
  // Obținem id-ul rezervării din URL
  const { bookingId } = useParams();
  // Executăm un query cu react-query pentru a obține detaliile rezervării
  const {
    isLoading,
    data: booking,
    error,
  } = useQuery({
    queryKey: ["booking", bookingId], // Cheia unică pentru cache-ul react-query (include bookingId pentru cache specific)
    queryFn: () => getBooking(bookingId),
    // RQ by default fetch datele de 3 ori, oprim comportamentul default
    retry: false,
  });
  return { isLoading, booking, error };
}
