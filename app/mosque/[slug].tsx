import { calculateDistance } from "@/lib/distance";
import { useMosque } from "@/hooks/mosques";
import { useLocationStore } from "@/store";
import { Media } from "@/types/mosque";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Carousel from "react-native-snap-carousel";

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL!;

export default function MosqueDetailsPage() {
  const { slug: id } = useLocalSearchParams<{ slug: string }>();
  const { userLatitude, userLongitude } = useLocationStore();
  const [activeSlide, setActiveSlide] = useState(0);

  const { mosque, isLoading, isError, error } = useMosque(id as string);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error: {error?.message}</Text>
      </View>
    );
  }

  if (!mosque) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Mosque not found</Text>
      </View>
    );
  }

  const distance = () => {
    if (userLatitude !== null && userLongitude !== null) {
      return calculateDistance(
        userLatitude,
        userLongitude,
        mosque.position[1],
        mosque.position[0]
      ).toFixed(2);
    }
    return "Unknown";
  };

  const navigateToGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mosque.position[1]},${mosque.position[0]}`;
    Linking.openURL(url);
  };

  const defaultImageUri = "https://example.com/default-mosque-image.jpg";
  const imageUrls = mosque.images?.map(
    (img) => baseUrl + (img.image as Media).url
  ) || [defaultImageUri];

  const renderCarouselItem = ({ item }: { item: string | undefined }) => (
    <Image source={{ uri: item }} className="w-full h-64" resizeMode="cover" />
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <Text>{mosque.name}</Text>
      <View className="relative">
        <Carousel
          data={imageUrls}
          renderItem={renderCarouselItem}
          sliderWidth={Dimensions.get("window").width}
          itemWidth={Dimensions.get("window").width}
          onSnapToItem={(index) => setActiveSlide(index)}
        />
        <Text>{mosque.name}</Text>
        <View className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4">
          <Text className="text-2xl font-bold text-white">{mosque.name}</Text>
        </View>
      </View>
      <View className="p-4">
        <View className="flex-row items-center mb-4">
          <Ionicons name="location-outline" size={18} color="#4B5563" />
          <Text className="text-gray-600 ml-2 flex-1 text-base">
            {mosque.address}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center">
            <MaterialCommunityIcons
              name="map-marker-distance"
              size={18}
              color="#4B5563"
            />
            <Text className="text-gray-600 ml-2 text-base">
              {distance()} km away
            </Text>
          </View>
          <TouchableOpacity
            onPress={navigateToGoogleMaps}
            className="bg-green-500 px-4 py-2 rounded-full flex-row items-center"
          >
            <MaterialCommunityIcons name="directions" size={18} color="white" />
            <Text className="text-white ml-2 font-semibold">Directions</Text>
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-semibold mb-3 text-gray-800">
            Status
          </Text>
          <View className="bg-blue-100 rounded-lg px-3 py-2">
            <Text className="text-blue-800 font-medium">
              {typeof mosque.status === "string"
                ? mosque.status
                : mosque.status.status || "Unknown"}
            </Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-semibold mb-3 text-gray-800">
            Facilities
          </Text>
          <View className="flex-row flex-wrap">
            {mosque.facilities.map((facility, index) => (
              <View
                key={index}
                className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
              >
                <Text className="text-gray-700">
                  {typeof facility === "string"
                    ? facility
                    : facility.facilities}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-xl font-semibold mb-3 text-gray-800">
            Other Properties
          </Text>
          <View className="space-y-2">
            {Object.entries(mosque).map(([key, value]) => {
              if (
                key !== "name" &&
                key !== "address" &&
                key !== "position" &&
                key !== "images" &&
                key !== "facilities" &&
                key !== "status"
              ) {
                return (
                  <View key={key} className="flex-row items-center">
                    <FontAwesome5
                      name="info-circle"
                      size={16}
                      color="#4B5563"
                    />
                    <Text className="text-gray-700 ml-2 capitalize">
                      {key.replace(/_/g, " ")}:{" "}
                    </Text>
                    <Text className="text-gray-900 ml-1">{String(value)}</Text>
                  </View>
                );
              }
              return null;
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
