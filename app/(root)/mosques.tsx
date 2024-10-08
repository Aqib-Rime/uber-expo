import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import Animated, {
  FadeIn,
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { fetchPlaceDetails } from "@/api/googlePlacesApi";
import { MapControls } from "@/app/components/MapControls";
import { MosqueMarker } from "@/app/components/MosqueMarker";
import { SkeletonLoading } from "@/app/components/SkeletonLoading";
import { useLocationPermission } from "@/app/hooks/useLocationPermission";
import { GoogleSearch } from "@/components/GoogleSearch";
import { MosqueBottomSheetContent } from "@/components/MosqueBottomSheetContent";
import { useFilteredMosques } from "@/hooks/mosques";
import { useLocationStore } from "@/store";
import { useMosqueFilterStore } from "@/store/mosqueFilterStore";
import { Mosque } from "@/types/mosque";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { MosqueCard } from "@/components/MosqueCard";

interface PlaceSuggestion {
  place_id: string;
  description: string;
}

const Page: React.FC = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const setSearchQuery = useMosqueFilterStore((state) => state.setSearchQuery);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const marginTopAnim = useSharedValue<number>(0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const translateX = useSharedValue<number>(0);
  const { userLatitude, userLongitude, setUserLocation } = useLocationStore();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useLocationPermission();
  const mosques = useFilteredMosques();

  const handleFocus = (): void => {
    setIsFocused(true);
    setActiveTab("recent");
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleBlur = (): void => {
    setIsFocused(false);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const [currentSheetIdx, setCurrentSheetIdx] = useState<number>(0);
  const [tappedMosque, setTappedMosque] = useState<Mosque | null>(null);
  const [activeTab, setActiveTab] = useState<"recent" | "filter">("recent");

  const showRecentAndFilters = currentSheetIdx === 1;

  const toggleTab = (): void => {
    setActiveTab((prev) => (prev === "recent" ? "filter" : "recent"));
    translateX.value = withTiming(0);
  };

  const mapRef = useRef<MapView>(null);
  const snapPoints = useMemo<string[]>(() => ["20%", "100%"], []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > 100) {
        runOnJS(toggleTab)();
      } else {
        translateX.value = withTiming(0);
      }
    },
  });

  const handleSelectPlace = async (
    suggestion: PlaceSuggestion
  ): Promise<void> => {
    try {
      const { lat, lng } = await fetchPlaceDetails(suggestion.place_id);

      mapRef.current?.animateToRegion({
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      // Handle error
    } finally {
      bottomSheetRef.current?.snapToIndex(0);
    }
  };

  const handleSearchBarFocus = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  useEffect(() => {
    if (tappedMosque) {
      bottomSheetModalRef.current?.present();
    }
  }, [tappedMosque]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <Animated.View
      className="relative w-full h-full"
      entering={FadeIn.duration(300)}
    >
      <MapView
        provider={PROVIDER_DEFAULT}
        ref={mapRef}
        className="w-full h-full rounded-2xl"
        tintColor="black"
        mapType="standard"
        showsPointsOfInterest={false}
        showsCompass={false}
        showsUserLocation={true}
        showsMyLocationButton={false}
        region={{
          latitude: userLatitude ?? 23.8041,
          longitude: userLongitude ?? 90.4152,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onMapReady={() => setIsLoading(false)}
      >
        {(mosques.mosques ?? []).map((mosque) => (
          <MosqueMarker
            key={mosque.id}
            mosque={mosque}
            onPress={() => {
              setTappedMosque(mosque);
              bottomSheetRef.current?.snapToIndex(0);
            }}
          />
        ))}
      </MapView>

      <TouchableOpacity
        className="bg-white p-2 rounded-full shadow-md absolute top-10 left-4"
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Ionicons name="menu" size={24} color="#22c55e" />
      </TouchableOpacity>

      <MapControls
        onLocatePress={() => {
          if (userLatitude && userLongitude) {
            mapRef.current?.animateToRegion({
              latitude: userLatitude,
              longitude: userLongitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
          }
        }}
        onFilterPress={() => {
          setSearchQuery("");
          setActiveTab("filter");
          bottomSheetRef.current?.snapToIndex(1);
          bottomSheetModalRef.current?.close();
        }}
      />

      <BottomSheet
        onChange={(e: number) => {
          marginTopAnim.value = withTiming(e === 0 ? -20 : 0, {
            duration: 300,
          });
          setCurrentSheetIdx(e);
        }}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        index={0}
      >
        <MosqueBottomSheetContent
          setSearchQuery={setSearchQuery}
          isFullScreen={isFullScreen}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          toggleTab={toggleTab}
          activeTab={activeTab}
          translateX={translateX}
          gestureHandler={gestureHandler}
          bottomSheetRef={bottomSheetRef}
          marginTopAnim={marginTopAnim}
          showRecentAndFilters={showRecentAndFilters}
          searchComponent={<GoogleSearch onSelectPlace={handleSelectPlace} />}
          onSearchBarFocus={handleSearchBarFocus}
        />
      </BottomSheet>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        onDismiss={() => setTappedMosque(null)}
        snapPoints={["40%"]}
      >
        {tappedMosque ? (
          <MosqueCard
            mosque={tappedMosque}
            onPress={() => {
              bottomSheetModalRef.current?.close();
            }}
          />
        ) : (
          <SkeletonLoading />
        )}
      </BottomSheetModal>
    </Animated.View>
  );
};

export default Page;
