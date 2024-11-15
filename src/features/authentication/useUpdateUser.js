import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateUser as updateUserApi } from "../../services/apiAuth";

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { isLoading: isUpdating, mutate: updateUser } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: ({ user }) => {
      toast.success("Success updating user");
      queryClient.setQueryData(["user"], user);
      //   queryClient.invalidateQueries({
      //     queryKey: ["user"],
      //   });
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateUser, isUpdating };
}
