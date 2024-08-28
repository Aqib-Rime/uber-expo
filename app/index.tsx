import {
  AntDesign,
  Feather,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import Animated, {
  FadeIn,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  useAnimatedGestureHandler,
  runOnJS,
} from "react-native-reanimated";

const recentSearches: {
  name: string;
  location: string;
  hotNote?: { text: string; color: string };
}[] = [
  {
    name: "Mosque A",
    location: "Jakarta",
    hotNote: {
      text: "Hot",
      color: "red",
    },
  },
  {
    name: "Mosque B",
    location: "Bandung",
  },
  {
    name: "Mosque C",
    location: "Surabaya",
    hotNote: {
      text: "Hot",
      color: "red",
    },
  },
  {
    name: "Mosque D",
    location: "Yogyakarta",
    hotNote: {
      text: "Hot",
      color: "red",
    },
  },
];

const filterOptions = [
  { id: "salahMale", label: "Salah Male", icon: "male" },
  { id: "salahFemale", label: "Salah Female", icon: "female" },
  { id: "wudhuMale", label: "Wudhu Male", icon: "tint" },
  { id: "wudhuFemale", label: "Wudhu Female", icon: "tint" },
  { id: "jummahMale", label: "Jummah Male", icon: "mosque" },
  { id: "jummahFemale", label: "Jummah Female", icon: "mosque" },
];

const Page = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const marginTopAnim = useSharedValue(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"recent" | "filter">("recent");
  const translateX = useSharedValue(0);

  useEffect(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleSearch = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleFocus = () => {
    setIsFocused(true);
    bottomSheetRef.current?.snapToIndex(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleSheetChange = useCallback((index: number) => {
    if (index === 1) {
      console.log("Bottom sheet is fully open");
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
    }
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      marginTop: marginTopAnim.value,
    };
  });

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

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

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View className="relative w-full h-full">
      <MapView
        provider={PROVIDER_DEFAULT}
        className="w-full h-full rounded-2xl"
        tintColor="black"
        mapType="standard"
        showsPointsOfInterest={false}
        showsCompass={false}
        userInterfaceStyle="light"
        onMarkerPress={({ nativeEvent }) => {
          console.log(nativeEvent.coordinate);
        }}
      />
      <TouchableOpacity
        onPress={() => {
          setActiveTab("filter");
          bottomSheetRef.current?.snapToIndex(1);
        }}
        className="absolute top-12 right-4 bg-white p-2 rounded-full shadow-md"
      >
        <AntDesign name="filter" size={24} color="#22c55e" />
      </TouchableOpacity>
      <BottomSheetModal
        onChange={(e) => {
          marginTopAnim.value = withTiming(e === 0 ? -20 : 0, {
            duration: 300,
          });
          handleSheetChange(e);
        }}
        ref={bottomSheetRef}
        snapPoints={["20%", "100%"]}
        enablePanDownToClose={false}
        index={0}
      >
        <Animated.View className={"px-4 pt-6"} style={animatedStyles}>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-2">
            <TouchableOpacity
              className="flex-row gap-x-3 items-center"
              onPress={handleSearch}
            >
              <View>
                {isFullScreen ? (
                  <Ionicons
                    style={{ marginLeft: -4 }}
                    name="arrow-back"
                    size={20}
                    color="black"
                    onPress={() => bottomSheetRef.current?.snapToIndex(0)}
                  />
                ) : (
                  <FontAwesome6 name="location-dot" size={20} color="#22c55e" />
                )}
              </View>

              <BottomSheetTextInput
                placeholder="Search nearby mosques"
                className="flex-1"
                onChangeText={setSearchQuery}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </TouchableOpacity>
          </View>
          <AddMosqueButton />

          {/* Tabs */}
          <TouchableOpacity
            className="flex-row mt-4 mb-2 items-center justify-center bg-gray-200 rounded-full p-1"
            onPress={toggleTab}
          >
            <Animated.View
              className={`flex-1 py-2 px-4 rounded-full ${
                activeTab === "recent" ? "bg-white" : ""
              }`}
              layout={FadeIn}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "recent" ? "text-green-500" : "text-slate-500"
                }`}
              >
                Recent
              </Text>
            </Animated.View>
            <Animated.View
              className={`flex-1 py-2 px-4 rounded-full ${
                activeTab === "filter" ? "bg-white" : ""
              }`}
              layout={FadeIn}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === "filter" ? "text-green-500" : "text-slate-500"
                }`}
              >
                Filter
              </Text>
            </Animated.View>
          </TouchableOpacity>

          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={animatedContentStyle}>
              {/* Recents */}
              {activeTab === "recent" && (
                <Animated.View
                  className="mt-1"
                  entering={SlideInLeft.duration(300)}
                  exiting={SlideOutLeft.duration(300)}
                >
                  <Animated.View className="mt-2">
                    {recentSearches.map((search, index) => (
                      <Animated.View key={index}>
                        <TouchableOpacity className="bg-white rounded-lg shadow-md flex-row items-center gap-x-2">
                          <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-2">
                            <Feather name="clock" size={20} color="black" />
                          </View>
                          <View className="gap-y-1 w-full">
                            <Text className="text-slate-500 font-semibold text-md">
                              {search.name}
                            </Text>
                            <Text className="text-slate-400">
                              {search.location}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View className="ml-12 mt-1">
                          {search.hotNote && (
                            <Animated.Text className="text-red-500">
                              {search.hotNote.text}
                            </Animated.Text>
                          )}
                          {index < recentSearches.length - 1 && (
                            <Animated.View className="border-b border-gray-300 my-1" />
                          )}
                        </View>
                      </Animated.View>
                    ))}
                  </Animated.View>
                </Animated.View>
              )}
              {/* Filters */}
              {activeTab === "filter" && (
                <Animated.View
                  className="mt-1"
                  entering={SlideInRight.duration(300)}
                  exiting={SlideOutRight.duration(300)}
                >
                  <Animated.View className="mt-2">
                    <View className="flex gap-2">
                      {filterOptions.map((option) => (
                        <TouchableOpacity
                          key={option.id}
                          className={`border-2 ${
                            selectedFilters.includes(option.id)
                              ? "border-green-300"
                              : "border-slate-200"
                          } px-4 rounded-lg flex-row items-center justify-between py-3 flex`}
                          onPress={() => toggleFilter(option.id)}
                        >
                          <Text
                            className={`font-bold text-sm ${
                              selectedFilters.includes(option.id)
                                ? "text-green-500"
                                : "text-slate-500"
                            }`}
                          >
                            {option.label}
                          </Text>
                          <FontAwesome5
                            name={option.icon}
                            size={20}
                            color={
                              selectedFilters.includes(option.id)
                                ? "#22c55e"
                                : "#64748b"
                            }
                            style={{ marginRight: 8 }}
                          />
                        </TouchableOpacity>
                      ))}
                    </View>
                  </Animated.View>
                  <FilterButton />
                </Animated.View>
              )}
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </BottomSheetModal>
    </View>
  );
};

export default Page;

function AddMosqueButton() {
  return (
    <View className="flex-row mt-2">
      <TouchableOpacity className="border-2 border-green-300 px-4 py-3 rounded-lg flex flex-1 flex-row bg-green-100 items-center justify-center">
        <Ionicons
          name="add"
          size={24}
          style={{ marginRight: 8 }}
          color="#22c55e"
        />
        <Text className="font-bold text-md text-green-500">Add Mosque</Text>
      </TouchableOpacity>
    </View>
  );
}

function FilterButton() {
  return (
    <View className="flex-row mt-2">
      <TouchableOpacity className="border-2 border-green-300 px-4 py-3 rounded-lg flex flex-1 flex-row bg-green-100 items-center justify-center mt-4">
        <Ionicons
          name="filter"
          size={24}
          style={{ marginRight: 8 }}
          color="#22c55e"
        />
        <Text className="font-bold text-md text-green-500">Filter</Text>
      </TouchableOpacity>
    </View>
  );
}
