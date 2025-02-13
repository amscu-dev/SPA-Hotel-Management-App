import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking as deleteBookingAPI } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const { mutate: deleteBooking, isLoading: isDeleteBooking } = useMutation({
    mutationFn: (id) => deleteBookingAPI(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        // Va invalida toate query-urile ce contin bookings
        queryKey: ["bookings"],
      });
      console.log(data);
      toast.success(`Booking  successfully deleted`);
    },
    // onErr are access la eroarea arunnta din deleteCabin(denumita si mutation function)
    onError: (err) => toast.error(err.message),
  });
  return { deleteBooking, isDeleteBooking };
}
