import React from "react";
import { View, TouchableOpacity } from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";

type MapControlsProps = {
  onLocatePress: () => void;
  onFilterPress: () => void;
};

export const MapControls: React.FC<MapControlsProps> = ({
  onLocatePress,
  onFilterPress,
}) => (
  <View className="flex flex-col gap-y-2 absolute top-10 right-4">
    <TouchableOpacity
      onPress={onLocatePress}
      className="bg-white p-2 rounded-full shadow-md"
    >
      <Ionicons name="locate" size={24} color="#22c55e" />
    </TouchableOpacity>
    <TouchableOpacity
      onPress={onFilterPress}
      className="bg-white p-2 rounded-full shadow-md"
    >
      <AntDesign name="filter" size={24} color="#22c55e" />
    </TouchableOpacity>
  </View>
);
