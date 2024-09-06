import BottomSheet, { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import { runOnJS, useAnimatedGestureHandler, useSharedValue, withTiming } from "react-native-reanimated";

import { BottomSheetContent } from "@/components/MosqueBottomSheetContent";
import { useLocationStore } from "@/store";
import { Mosque } from "@/types/mosque";
import { useLocationPermission } from "@/app/hooks/useLocationPermission";
import { useFilteredMosques } from "@/hooks/mosques";
import { MosqueMarker } from "@/app/components/MosqueMarker";
import { MapControls } from "@/app/components/MapControls";
import { MosqueCard } from "@/app/components/MosqueCard";
import { SkeletonLoading } from "@/app/components/SkeletonLoading";

const Page = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const marginTopAnim = useSharedValue(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const translateX = useSharedValue(0);
  const { userLatitude, userLongitude, setUserLocation } = useLocationStore();
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useLocationPermission();
  const mosques = useFilteredMosques();

  const handleSearch = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setActiveTab("recent");
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const [currentSheetIdx, setCurrentSheetIdx] = useState(0);
  const [tappedMosque, setTappedMosque] = useState<Mosque | null>(null);
  const [activeTab, setActiveTab] = useState<"recent" | "filter">("recent");

  const showRecentAndFilters = currentSheetIdx === 1;

  const toggleTab = () => {
    setActiveTab((prev) => (prev === "recent" ? "filter" : "recent"));
    translateX.value = withTiming(0);
  };

  const mapRef = useRef<MapView>(null);
  const snapPoints = useMemo(() => ["20%", "100%"], []);
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

  useEffect(() => {
    console.log("tappedMosque", tappedMosque);
    if (tappedMosque) {
      bottomSheetModalRef.current?.present();
    }
  }, [tappedMosque]);

  return (
    <View className="relative w-full h-full">
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
          setActiveTab("filter");
          bottomSheetRef.current?.snapToIndex(1);
          bottomSheetModalRef.current?.close();
        }}
      />

      <BottomSheet
        onChange={(e) => {
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
        <BottomSheetContent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isFullScreen={isFullScreen}
          handleSearch={handleSearch}
          handleFocus={handleFocus}
          handleBlur={handleBlur}
          toggleTab={toggleTab}
          activeTab={activeTab}
          translateX={translateX}
          gestureHandler={gestureHandler}
          bottomSheetRef={bottomSheetRef}
          marginTopAnim={marginTopAnim}
          showRecentAndFilters={showRecentAndFilters}
        />
      </BottomSheet>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        onDismiss={() => setTappedMosque(null)}
        snapPoints={["40%"]}
      >
        {tappedMosque ? (
          <MosqueCard mosque={tappedMosque} />
        ) : (
          <SkeletonLoading />
        )}
      </BottomSheetModal>
    </View>
  );
};

export default Page;
