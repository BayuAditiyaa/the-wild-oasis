import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/apiAuth";

export function useUser() {
  const {
    data: user,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryFn: getUser,
    queryKey: ["user"],
  });

  return {
    user,
    isLoading,
    isAuthenticated: user?.role === "authenticated",
    isFetching,
    error,
  };
}
