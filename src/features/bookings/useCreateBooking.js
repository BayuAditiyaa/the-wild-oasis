import { useMutation, useQueryClient } from "@tanstack/react-query";
import { newBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useCreateBooking() {
  const queryClient = useQueryClient();

  const { isLoading: isCreating, mutate: createBooking } = useMutation({
    mutationFn: newBooking,
    onSuccess: () => {
      toast.success("Success creating booking");
      queryClient.invalidateQueries({
        queryKey: ["booking"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createBooking };
}
