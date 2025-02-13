import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login as loginAPI } from "../../services/apiAuth";

// Cream hook-ul personalizat useLogin pentru gestionarea autentificării
export function useLogin() {
  const queryClient = useQueryClient(); // Obținem clientul de query pentru a manipula cache-ul de date
  const navigate = useNavigate(); // Obținem funcția de navigare

  const { mutate: login, isLoading } = useMutation({
    // Folosim useMutation pentru a crea o mutație (în acest caz, autentificare)
    mutationFn: ({ email, password }) => loginAPI({ email, password }), // Funcția de mutație care apelează API-ul de autentificare
    onSuccess: (user) => {
      // Funcția care se execută la succesul mutației
      queryClient.setQueryData(["user"], user.user); // Setăm datele utilizatorului în cache-ul React Query
      navigate("/dashboard", { replace: true }); // Navigăm către dashboard-ul utilizatorului după autentificare, înlocuind istoricul paginilor
    },
    onError: (err) => {
      // Funcția care se execută în caz de eroare
      console.log("ERROR", err); // Afișăm eroarea în consolă pentru depanare
      toast.error("Provided email or password are incorrect"); // Afișăm un mesaj de eroare utilizând toast
    },
  });

  return { login, isLoading }; // Returnăm funcția de login și starea de încărcare (pentru a dezactiva butoanele în timpul procesului)
}
