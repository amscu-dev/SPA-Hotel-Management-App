import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateCurrentUser } from "../../services/apiAuth";

export function useUpdateUser() {
  const queryClient = useQueryClient(); // Obținem clientul de query pentru a manipula cache-ul datelor
  const { mutate: updateUser, isLoading: isUpdating } = useMutation({
    mutationFn: updateCurrentUser,
    onSuccess: ({ user }) => {
      toast.success("User account successfully updated!");
      queryClient.setQueryData(["user"], user); // Actualizăm datele utilizatorului în cache
    },
    // Gestioneaza erorile din comunicarea cu backend-ul
    onError: (err) => toast.error(err.message),
  });
  return { updateUser, isUpdating };
}
