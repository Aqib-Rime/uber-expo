import React from "react";
import { Linking, View, Text, TouchableOpacity } from "react-native";
import { useLocationStore } from "@/store";
import { Mosque } from "@/types/mosque";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { calculateDistance } from "../utils/distance";

type MosqueCardProps = {
  mosque: Mosque;
};

export const MosqueCard: React.FC<MosqueCardProps> = ({ mosque }) => {
  const currentLat = useLocationStore((state) => state.userLatitude);
  const currentLng = useLocationStore((state) => state.userLongitude);

  const distance =
    currentLat !== null && currentLng !== null
      ? calculateDistance(
          currentLat,
          currentLng,
          mosque.position[1],
          mosque.position[0]
        ).toFixed(2)
      : "Unknown";

  const navigateToGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mosque.position[1]},${mosque.position[0]}`;
    Linking.openURL(url);
  };

  return (
    <View className="p-4 bg-white rounded-lg shadow-md">
      <Text className="text-xl font-bold mb-2">{mosque.name}</Text>
      <Text className="text-gray-600 mb-2">{mosque.address}</Text>
      <Text className="text-gray-600 mb-4">{distance} km away</Text>
      <TouchableOpacity
        onPress={navigateToGoogleMaps}
        className="flex-row items-center justify-center bg-green-500 p-2 rounded-md"
      >
        <MaterialCommunityIcons name="navigation" size={24} color="white" />
        <Text className="text-white ml-2">Navigate</Text>
      </TouchableOpacity>
    </View>
  );
};
