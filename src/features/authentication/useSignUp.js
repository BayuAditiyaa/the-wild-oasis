import { useMutation } from "@tanstack/react-query";
import { signUp as signUpApi } from "../../services/apiAuth";
import toast from "react-hot-toast";
export function useSignUp() {
  const { mutate: signUp, isLoading } = useMutation({
    mutationFn: signUpApi,
    onSuccess: (data) => {
      console.log(data);
      toast.success(
        "User successfully created! please verify your email address."
      );
    },
    onError: (error) =>
      toast.error(error.message || "An error occurred during registration"),
  });

  return { signUp, isLoading };
}
