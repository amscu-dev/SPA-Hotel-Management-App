import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout as logoutAPI } from "../../services/apiAuth";

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: logout, isLoading } = useMutation({
    mutationFn: logoutAPI,
    onSuccess: () => {
      queryClient.removeQueries(); // Ștergem toate query-urile din cache-ul React Query, pentru a curăța datele utilizatorului
      navigate("/login", { replace: true }); // Navigăm utilizatorul la pagina de login după deconectare, înlocuind istoricul paginilor
    },
  });

  return { logout, isLoading };
}
