import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBooking } from "../../services/apiBookings";
import toast from "react-hot-toast";

export function useDeleteBooking() {
  const queryClient = useQueryClient();

  const { isLoading: isDeleting, mutate: deletingBooking } = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      toast.success("Success deleting booking");
      queryClient.invalidateQueries({
        queryKey: ["booking"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deletingBooking };
}
