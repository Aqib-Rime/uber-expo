import { useAuth, useUser } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FilterComponent } from "@/components/FilterComponent";
import Map from "@/components/Map";
import { useFacilities } from "@/hooks/facilities";
import { getAndSetAccessToken } from "@/lib/auth";
import { useLocationStore } from "@/store";

const Home = () => {
  const { user } = useUser();
  const { getToken, signOut } = useAuth();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { setUserLocation, setDestinationLocation } = useLocationStore();
  const { facilities, isPending, isError } = useFacilities();

  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [sheetComponent, setSheetComponent] = useState(0);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync(location.coords);
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          address: `${address[0].name}, ${address[0].region}`,
        });
      } else {
        setHasPermission(false);
      }
    };
    requestLocationPermission();
  }, [setUserLocation]);

  useEffect(() => {
    if (user) {
      getAndSetAccessToken(user, getToken, "google").then(() => {
        console.log("Access token set for Google user");
      });
    }
  }, [user, getToken]);

  const handleSignOut = () => {
    signOut();
    router.replace("/(auth)/sign-in");
  };

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  const renderSheetComponent = () => {
    switch (sheetComponent) {
      case 0:
        return <FilterComponent />;
      case 1:
        return <Text>Component 1</Text>;
      case 2:
        return <Text>Component 2</Text>;
      default:
        return <Text>Component 1</Text>;
    }
  };

  return (
    <View className="flex-1 relative">
      <Map />
      <SafeAreaView className="absolute p-6 top-0 flex-1 flex flex-row justify-between w-full items-center">
        <TouchableOpacity
          onPress={() => {
            setSheetComponent(0);
            bottomSheetRef.current?.snapToIndex(1);
          }}
          className="bg-white p-3 rounded-full flex flex-row items-center justify-center"
        >
          <AntDesign name="filter" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity className="bg-white p-3 rounded-full flex flex-row items-center justify-center">
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </SafeAreaView>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["1%", "40%", "65%"]}
        index={0}
      >
        {renderSheetComponent()}
      </BottomSheet>
    </View>
  );
};

export default Home;

const GoogleSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    // Implement search functionality here
  };

  return (
    <View className="p-4 flex flex-row items-center">
      <TextInput
        className="border-2 border-white bg-gray-200 rounded-2xl px-4 py-4 mb-4 w-full"
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
};
