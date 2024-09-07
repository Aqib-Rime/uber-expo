import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Animated,
  TextInput,
  ActivityIndicator,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { TouchableOpacity } from "react-native-gesture-handler";

const CustomMarker = ({ color = "#FF0000" }) => (
  <View
    style={{
      width: 50,
      height: 50,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <View
      style={{
        position: "absolute",
        bottom: 0,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        transform: [{ scaleX: 2 }],
      }}
    />
    <View
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: "white",
        }}
      />
    </View>
    <View
      style={{
        position: "absolute",
        bottom: 0,
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 20,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: color,
      }}
    />
  </View>
);

export default function MapPicker() {
  const router = useRouter();
  const { onSelect, returnStep } = useLocalSearchParams();
  const [region, setRegion] = useState<Region | null>(null);
  const [address, setAddress] = useState("");
  const mapRef = useRef<MapView>(null);
  const animValue = useRef(new Animated.Value(0)).current;
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const newRegion: Region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 1000);
    onRegionChangeComplete(newRegion);
  };

  const onRegionChangeComplete = useCallback(async (newRegion: Region) => {
    setIsSelecting(false);
    Animated.timing(animValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
    try {
      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      });
      if (addressResult) {
        setAddress(
          `${addressResult.name}, ${addressResult.street}, ${addressResult.city}, ${addressResult.region}, ${addressResult.country}`
        );
      }
    } catch (error) {}
  }, []);

  const onPanDrag = useCallback(() => {
    if (!isSelecting) {
      setIsSelecting(true);
      Animated.timing(animValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelecting, animValue]);

  const handleConfirm = () => {
    if (region && address) {
      router.push({
        pathname: onSelect as any,
        params: {
          address: address,
          latitude: region.latitude.toString(),
          longitude: region.longitude.toString(),
          returnStep: returnStep, // Pass back the returnStep
        },
      });
    }
  };

  const pinTranslateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const contentOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  return (
    <View className="flex-1">
      <TouchableOpacity
        className="absolute top-12 left-4 z-10 bg-white p-2 rounded-full shadow-md"
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#22c55e" />
      </TouchableOpacity>
      {region && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={region}
          onRegionChangeComplete={onRegionChangeComplete}
          onPanDrag={onPanDrag}
        />
      )}
      <Animated.View
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: -25,
          marginTop: -50,
          transform: [{ translateY: pinTranslateY }],
        }}
      >
        <CustomMarker color="#FF0000" />
      </Animated.View>
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: !isSelecting ? "auto" : 100,
        }}
        className="bg-white p-4 rounded-t-3xl shadow-lg"
      >
        <Animated.View style={{ opacity: contentOpacity }}>
          <Text className="text-lg font-semibold mb-2">Selected Location</Text>
          <View className="bg-gray-100 rounded-lg p-3 mb-2">
            <TextInput
              value={address}
              editable={false}
              multiline
              className="text-gray-700"
            />
          </View>
          <View className="flex-row mb-4">
            <View className="flex-1 bg-gray-100 rounded-lg p-3 mr-2">
              <Text className="text-xs text-gray-500 mb-1">Latitude</Text>
              <TextInput
                value={region?.latitude.toFixed(6)}
                editable={false}
                className="text-gray-700"
              />
            </View>
            <View className="flex-1 bg-gray-100 rounded-lg p-3 ml-2">
              <Text className="text-xs text-gray-500 mb-1">Longitude</Text>
              <TextInput
                value={region?.longitude.toFixed(6)}
                editable={false}
                className="text-gray-700"
              />
            </View>
          </View>
          <TouchableOpacity
            className="border-2 border-green-300 px-4 py-3 rounded-lg items-center justify-center bg-green-100"
            onPress={handleConfirm}
            disabled={!region || !address}
          >
            <Text
              className={`font-bold text-md ${
                region && address ? "text-green-500" : "text-gray-400"
              }`}
            >
              Confirm Location
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={{
            opacity: animValue,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="mt-2 text-gray-600">Selecting location...</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}
