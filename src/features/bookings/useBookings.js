import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { getBookings } from "../../services/apiBookings";
import { PAGE_SIZE } from "../../utils/constants";

export function useBookings() {
  const queryClient = useQueryClient(); // Obținem clientul query pentru a putea face prefetching
  const [searchParams] = useSearchParams(); // Obținem parametrii din URL pentru a filtra, sorta și pagina rezervările

  // FILTER
  const filterValue = searchParams.get("status") || "all"; // Obținem valoarea filtrului 'status' din URL sau setăm 'all' dacă nu există
  const filter =
    !filterValue || filterValue === "all"
      ? null // Dacă valoarea este "all" sau nu există, nu aplicăm niciun filtru
      : { field: "status", value: filterValue }; // Altfel, setăm un filtru pe câmpul "status"

  // SORT
  const sortByRaw = searchParams.get("sortBy") || "startDate-desc"; // Obținem valoarea de sortare din URL sau setăm valoarea implicită
  const [field, direction] = sortByRaw.split("-"); // Împărțim valoarea în câmpul de sortare și direcția de sortare
  const sortBy = { field, direction }; // Cream un obiect pentru a reprezenta opțiunea de sortare

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page")); // Obținem numărul paginii din URL sau setăm pagina implicită la 1

  // Executăm un query cu react-query pentru a obține lista de rezervări
  const {
    isLoading,
    data: { data: bookings, count } = {},
    error,
  } = useQuery({
    queryKey: ["bookings", filter, sortBy, page], // Cheia unică pentru cache-ul react-query (include filtrele, sortarea și pagina)
    queryFn: () => getBookings({ filter, sortBy, page }),
  });

  // PRE-FETCH
  // Calculăm numărul total de pagini pe baza numărului total de rezervări
  const pageCount = Math.ceil(count / PAGE_SIZE);
  // Dacă mai există pagini după pagina curentă, prefetchăm următoarea pagină
  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page + 1],
      queryFn: () => getBookings({ filter, sortBy, page: page + 1 }),
    });
  // Dacă suntem pe o pagină mai mare decât 1, prefetchăm pagina anterioară
  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["bookings", filter, sortBy, page - 1],
      queryFn: () => getBookings({ filter, sortBy, page: page - 1 }),
    });

  return { isLoading, bookings, error, count };
}
