import React from "react";
import { Linking, View, Text, TouchableOpacity, Image } from "react-native";
import { useLocationStore } from "@/store";
import { Media, Mosque } from "@/types/mosque";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { calculateDistance } from "../lib/distance";
import { useRouter, Link } from "expo-router";

type MosqueCardProps = {
  mosque: Mosque;
  onPress: () => void;
};

export const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL!;

export const MosqueCard: React.FC<MosqueCardProps> = ({ mosque, onPress }) => {
  const { userLatitude, userLongitude } = useLocationStore();
  const router = useRouter();

  const distance = React.useMemo(() => {
    if (userLatitude !== null && userLongitude !== null) {
      return calculateDistance(
        userLatitude,
        userLongitude,
        mosque.position[1],
        mosque.position[0]
      ).toFixed(2);
    }
    return "Unknown";
  }, [userLatitude, userLongitude, mosque.position]);

  const navigateToGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mosque.position[1]},${mosque.position[0]}`;
    Linking.openURL(url);
  };

  const defaultImageUri = "https://example.com/default-mosque-image.jpg";
  const imageUrl =
    baseUrl + (mosque.images?.[0]?.image as Media).url ?? defaultImageUri;

  return (
    <View className="rounded-2xl shadow-lg overflow-hidden mb-4 mx-2">
      <View className="relative">
        <Link href={`/gest/${mosque.id}`} asChild>
          <Text className="bg-red-500 font-bold text-center py-10">Go to</Text>
        </Link>
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-40"
          resizeMode="cover"
        />
        <Link href={`/mosque/${mosque.id}`} asChild>
          <TouchableOpacity
            onPress={onPress}
            className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md"
          >
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#22c55e"
            />
          </TouchableOpacity>
        </Link>
      </View>
      <View className="p-3 bg-green-100">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          {mosque.name}
        </Text>
        <View className="flex-row items-center mb-2">
          <Ionicons name="location-outline" size={14} color="#4B5563" />
          <Text className="text-gray-600 ml-1 flex-1 text-sm">
            {mosque.address}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={16}
              color="#4B5563"
            />
            <Text className="text-gray-600 ml-1 text-sm">
              {distance} km away
            </Text>
          </View>
          <TouchableOpacity
            onPress={navigateToGoogleMaps}
            className="bg-green-500 p-2 rounded-full"
          >
            <MaterialCommunityIcons name="directions" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
