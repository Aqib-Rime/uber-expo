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
      const data = await fetchData<MosqueFacility[]>("get-facilities");
      console.log(data);

      return data;
    },
  });
  return { facilities, isPending, isError };
}
