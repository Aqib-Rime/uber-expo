import { useQuery } from "@tanstack/react-query";

import { fetchData } from "@/lib/apiClient";
import { MosqueFacility } from "@/types/mosque";

export function useFacilities() {
  const {
    data: facilities,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["facilities"],
    queryFn: async () => {
      return await fetchData<MosqueFacility[]>("get-facilities");
    },
  });
  return { facilities, isPending, isError };
}
