import { create } from "zustand";

interface MosqueFilterInfo {
  facilities: string[];
  radius: number;
  setFacilities: (facilities: string[]) => void;
  setRadius: (radius: number) => void;
}

export const useMosqueFilterStore = create<MosqueFilterInfo>((set) => ({
  facilities: [],
  radius: 5000,
  setFacilities: (facilities) => {
    console.log(facilities);
    return set({ facilities });
  },
  setRadius: (radius) => set({ radius }),
}));

export const useSelectedFacilities = () => {
  return useMosqueFilterStore((state) => state.facilities);
};

export const useCurrentRadius = () => {
  return useMosqueFilterStore((state) => state.radius);
};
