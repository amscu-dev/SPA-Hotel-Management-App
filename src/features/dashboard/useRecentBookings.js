import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { getBookingsAfterDate } from "../../services/apiBookings";

export function useRecentBookings() {
  // Obținem parametrii din URL pentru a determina intervalul de zile
  const [searchParams] = useSearchParams();

  // Obținem numărul de zile pentru care dorim să vedem rezervările
  // Dacă nu există parametru "last" în URL, setăm valoarea implicită la 7 zile
  const numDays = !searchParams.get("last")
    ? 7 // Dacă nu există parametru, setăm 7 zile
    : Number(searchParams.get("last")); // Dacă există parametru, folosim valoarea acestuia

  // Calculăm data de început a intervalului, cu numărul de zile înapoi
  const queryDate = subDays(new Date(), numDays).toISOString();

  const { isLoading, data: bookings } = useQuery({
    queryFn: () => getBookingsAfterDate(queryDate),
    queryKey: ["bookings", `last-${numDays}`],
  });

  return { isLoading, bookings };
}
