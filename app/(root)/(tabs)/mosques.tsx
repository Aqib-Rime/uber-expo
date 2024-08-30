import {
  AntDesign,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import * as Location from "expo-location";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import {
  runOnJS,
  useAnimatedGestureHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { BottomSheetContent } from "@/components/MosqueBottomSheetContent";
import { useFilteredMosques } from "@/hooks/mosques";
import { useLocationStore } from "@/store";
import { Mosque } from "@/types/mosque";

const Page = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const marginTopAnim = useSharedValue(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const translateX = useSharedValue(0);
  const { userLatitude, userLongitude, setUserLocation } = useLocationStore();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude!,
        longitude: location.coords?.longitude!,
      });

      setUserLocation({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    })();
  }, [setUserLocation]);

  const mosques = useFilteredMosques();

  useEffect(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleSearch = () => {
    bottomSheetRef.current?.snapToIndex(2);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setActiveTab("recent"); // Set active tab to "recent" on focus
    bottomSheetRef.current?.snapToIndex(2);
  };

  const handleBlur = () => {
    setIsFocused(false);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const [currentSheetIdx, setCurrentSheetIdx] = useState(0);
  const [tappedMosque, setTappedMosque] = useState<Mosque | null>(null);
  const [activeTab, setActiveTab] = useState<"recent" | "filter">("recent");

  const showRecentAndFilters = currentSheetIdx === 2;
  const showMosqueCard = currentSheetIdx === 1 && tappedMosque !== null;

  const toggleTab = () => {
    setActiveTab((prev) => (prev === "recent" ? "filter" : "recent"));
    translateX.value = withTiming(0);
  };

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

  const mapRef = useRef<MapView>(null);
  const snapPoints = useMemo(() => ["20%", "40%", "100%"], []);

  // TODO: on focus seach it should show recents
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
        onMarkerPress={({ nativeEvent }) => {
          console.log(nativeEvent.coordinate);
        }}
      >
        {(mosques.mosques ?? []).map((mosque) => (
          <Marker
            key={mosque.id}
            coordinate={{
              latitude: mosque.position[1],
              longitude: mosque.position[0],
            }}
            onSelect={() => {
              console.log("marker selected");
              setTappedMosque(mosque);
              bottomSheetRef.current?.snapToIndex(1);
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "green",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="map-marker-radius"
                size={24}
                color="white"
              />
            </View>
          </Marker>
        ))}
      </MapView>
      <View className="flex flex-col gap-y-2 absolute top-10 right-4">
        <TouchableOpacity
          onPress={() => {
            if (userLatitude && userLongitude) {
              mapRef.current?.animateToRegion({
                latitude: userLatitude,
                longitude: userLongitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              });
            }
          }}
          className=" bg-white p-2 rounded-full shadow-md"
        >
          <Ionicons name="locate" size={24} color="#22c55e" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab("filter");
            bottomSheetRef.current?.snapToIndex(2);
          }}
          className=" bg-white p-2 rounded-full shadow-md"
        >
          <AntDesign name="filter" size={24} color="#22c55e" />
        </TouchableOpacity>
      </View>

      <BottomSheetModal
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
        {!showMosqueCard && (
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
        )}
        {showMosqueCard && <MosqueCard mosque={tappedMosque} />}
      </BottomSheetModal>
    </View>
  );
};

export default Page;

function MosqueCard({ mosque }: { mosque: Mosque }) {
  const currentLat = useLocationStore((state) => state.userLatitude);
  const currentLng = useLocationStore((state) => state.userLongitude);
  const navigateToGoogleMaps = () => {
    const url = `geo:${mosque.position[1]},${mosque.position[0]}?q=${encodeURIComponent(mosque.name)}`;
    Linking.openURL(url);
  };

  return (
    <View className="px-2 h-full rounded-lg shadow-md flex flex-col gap-y-2">
      <View className="relative w-full h-[30vh] rounded-lg overflow-hidden">
        <Image
          source={{
            uri: "https://www.agoda.com/wp-content/uploads/2019/06/abu-dhabi-600875_1920-1920x1313.jpg",
          }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(0,0,0,1)", "rgba(0,0,0,0)"]}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0.5 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100%",
          }}
        >
          <View className="px-4 py-2 flex flex-row justify-between items-end h-full">
            <View>
              <Text
                className="text-white text-lg font-JakartaBold"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {mosque.name}
              </Text>
              <Text
                className="text-slate-300 font-JakartaSemiBold"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {mosque.address}
              </Text>
            </View>
          </View>
        </LinearGradient>
      </View>
      <View className="flex flex-row justify-between items-center mt-2">
        <View className="flex flex-row gap-x-2 items-center">
          <FontAwesome5 name="walking" size={24} color="#22c55e" />
          <Text className="text-slate-800 font-JakartaSemiBold ml-2">
            {`: ${calculateDistance(mosque.position[1], mosque.position[0], currentLat!, currentLng!).toFixed(2)} km`}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigateToGoogleMaps();
          }}
          className="bg-green-100 flex-row items-center gap-x-2 px-4 py-2 rounded-lg shadow-md"
        >
          <FontAwesome5 name="directions" size={24} color="#22c55e" />
          <Text className="text-slate-800 font-JakartaSemiBold ml-2 mb-1">
            Navigate
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLng = deg2rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};
