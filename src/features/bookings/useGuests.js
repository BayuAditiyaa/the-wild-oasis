import { useQuery } from "@tanstack/react-query";
import { getGuests } from "../../services/apiGuests";

export function useGuests() {
  const { data: guests, isLoadingGuests } = useQuery({
    queryFn: getGuests,
    queryKey: ["guests"],
  });

  return { guests, isLoadingGuests };
}
