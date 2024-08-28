import { useQuery } from "@tanstack/react-query";

import api from "@/lib/apiClient";
import { useLocationStore } from "@/store";
import {
  useCurrentRadius,
  useSelectedFacilities,
} from "@/store/mosqueFilterStore";
import { Mosque } from "@/types/mosque";

export const useFilteredMosques = () => {
  const facilities = useSelectedFacilities();
  const currentLat = useLocationStore((state) => state.userLatitude);
  const currentLng = useLocationStore((state) => state.userLongitude);
  const distance = useCurrentRadius();

  const { data, isLoading, isError } = useQuery<Mosque[], Error>({
    queryKey: [
      "mosques",
      "filtered",
      ...facilities.sort(),
      currentLat,
      currentLng,
      distance,
    ],
    queryFn: async () => {
      return await api
        .post("filterMosque", {
          json: {
            currentLat,
            currentLng,
            distance,
            facilities,
          },
        })
        .json<Mosque[]>();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return { mosques: data, isLoading, isError };
};
