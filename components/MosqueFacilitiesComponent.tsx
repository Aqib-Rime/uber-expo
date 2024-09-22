import { useFacilities } from "@/hooks/facilities";
import { useMosqueFilterStore } from "@/store/mosqueFilterStore";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react";
import { ActivityIndicator, View, Text, TouchableOpacity } from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";

export function MosqueFilterComponent({
  afterFilterApplied,
}: {
  afterFilterApplied: () => void;
}) {
  const { facilities, isPending } = useFacilities();
  const setFacilities = useMosqueFilterStore((state) => state.setFacilities);
  const [tempSelectedFacilities, setTempSelectedFacilities] = useState<
    string[]
  >(useMosqueFilterStore.getState().facilities);
  const [isApplying, setIsApplying] = useState(false);

  const toggleFacility = useCallback((facilityId: string) => {
    setTempSelectedFacilities((prev) =>
      prev.includes(facilityId)
        ? prev.filter((id) => id !== facilityId)
        : [...prev, facilityId]
    );
  }, []);

  const applyFilter = useCallback(() => {
    setFacilities(tempSelectedFacilities);
    setIsApplying(true);
    setTimeout(() => {
      afterFilterApplied();
      setIsApplying(false);
    }, 500);
  }, [setFacilities, tempSelectedFacilities, afterFilterApplied]);

  return (
    <Animated.View
      className="mt-1"
      entering={SlideInRight.duration(300)}
      exiting={SlideOutRight.duration(300)}
    >
      <Animated.View className="mt-2">
        <View className="flex gap-2">
          {isPending
            ? Array.from({ length: 5 }).map((_, index) => (
                <View
                  key={index}
                  className="border-2 border-slate-200 px-4 rounded-lg flex-row items-center justify-between py-3 flex overflow-hidden"
                >
                  <View className="bg-slate-200 h-4 w-24 rounded" />
                  <View className="bg-slate-200 h-5 w-5 rounded-full" />
                </View>
              ))
            : (facilities ?? []).map((option) => (
                <TouchableOpacity
                  key={option.id}
                  className={`border-2 ${tempSelectedFacilities.includes(option.id) ? "border-green-300" : "border-slate-200"} px-4 rounded-lg flex-row items-center justify-between py-3 flex`}
                  onPress={() => toggleFacility(option.id)}
                >
                  <Text
                    className={`font-bold text-sm ${tempSelectedFacilities.includes(option.id) ? "text-green-500" : "text-slate-500"}`}
                  >
                    {option.facilities}
                  </Text>
                  <FontAwesome5
                    name={
                      tempSelectedFacilities.includes(option.id)
                        ? "check-circle"
                        : "circle"
                    }
                    size={20}
                    color={
                      tempSelectedFacilities.includes(option.id)
                        ? "#22c55e"
                        : "#64748b"
                    }
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              ))}
        </View>
      </Animated.View>
      <View className="flex-row mt-2">
        <TouchableOpacity
          className={`border-2 px-4 py-3 rounded-lg flex flex-1 flex-row items-center justify-center mt-4 ${isPending || isApplying ? "border-green-300" : "border-green-300"}`}
          onPress={applyFilter}
        >
          {isPending || isApplying ? (
            <ActivityIndicator
              size={24}
              color="#22c55e"
              style={{ marginRight: 8 }}
            />
          ) : (
            <Ionicons
              name="filter"
              size={24}
              style={{ marginRight: 8 }}
              color="#22c55e"
            />
          )}
          <Text className="font-bold text-md text-green-500">
            {isPending
              ? "Loading..."
              : isApplying
                ? "Applying filter"
                : "Apply Filter"}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
