import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateSetting as updateSettingAPI } from "../../services/apiSettings";
export function useUpdateSetting() {
  const queryClient = useQueryClient();
  const { mutate: updateSetting, isLoading: isUpdating } = useMutation({
    mutationFn: updateSettingAPI,
    onSuccess: () => {
      toast.success("Setting successfully edited!");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    // Gestioneaza erorile din comunicarea cu backend-ul
    onError: (err) => toast.error(err.message),
  });
  return { updateSetting, isUpdating };
}
