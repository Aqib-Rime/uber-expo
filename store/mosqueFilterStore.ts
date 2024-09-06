import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RecentSearch {
  id: string;
  name: string;
  location: string;
}

interface MosqueFilterInfo {
  facilities: string[];
  radius: number;
  searchQuery: string;
  recentSearches: RecentSearch[];
  setFacilities: (facilities: string[]) => void;
  setRadius: (radius: number) => void;
  setSearchQuery: (searchQuery: string) => void;
  addRecentSearch: (search: RecentSearch) => void;
}

export const useMosqueFilterStore = create<MosqueFilterInfo>()(
  persist(
    (set) => ({
      facilities: [],
      radius: 5000,
      searchQuery: "",
      recentSearches: [],
      setFacilities: (facilities) => set({ facilities }),
      setRadius: (radius) => set({ radius }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      addRecentSearch: (search) =>
        set((state) => {
          const updatedSearches = [
            search,
            ...state.recentSearches.filter((s) => s.id !== search.id),
          ].slice(0, 5);
          return { recentSearches: updatedSearches };
        }),
    }),
    {
      name: "mosque-filter-storage",
    }
  )
);

export const useSelectedFacilities = () => {
  return useMosqueFilterStore((state) => state.facilities);
};

export const useCurrentRadius = () => {
  return useMosqueFilterStore((state) => state.radius);
};

export const useSearchQuery = () => {
  return useMosqueFilterStore((state) => state.searchQuery);
};

export const useRecentSearches = () => {
  return useMosqueFilterStore((state) => state.recentSearches);
};
