import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
  // FuncTia intermediara imi verifica daca query-ul este de actualitate
  // Folosim useQuery pentru a face o cerere pentru datele utilizatorului curent
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return { isLoading, user, isAuthenticated: user?.role === "authenticated" };
}
