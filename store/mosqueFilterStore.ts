import { create } from "zustand";

interface MosqueFilterInfo {
  facilities: string[];
  radius: number;
  setFacilities: (facilities: string[]) => void;
  setRadius: (radius: number) => void;
}

const useMosqueFilterStore = create<MosqueFilterInfo>((set) => ({
  facilities: [],
  radius: 500,
  setFacilities: (facilities) => set({ facilities }),
  setRadius: (radius) => set({ radius }),
}));

export const useSelectedFacilities = () => {
  return useMosqueFilterStore((state) => state.facilities);
};

export const useCurrentRadius = () => {
  return useMosqueFilterStore((state) => state.radius);
};
