import { MosqueFilterComponent } from "@/components/MosqueFacilitiesComponent";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { RefObject } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  GestureEvent,
  PanGesture,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  SharedValue,
  SlideInLeft,
  SlideOutLeft,
  useAnimatedStyle,
} from "react-native-reanimated";

const recentSearches = [
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

interface BottomSheetContentProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isFullScreen: boolean;
  showRecentAndFilters: boolean;
  handleSearch: () => void;
  handleFocus: () => void;
  handleBlur: () => void;
  toggleTab: () => void;
  activeTab: "recent" | "filter";
  translateX: SharedValue<number>;
  gestureHandler: (event: GestureEvent<PanGestureHandlerEventPayload>) => void;
  bottomSheetRef: RefObject<BottomSheet>;
  marginTopAnim: SharedValue<number>;
}

export const BottomSheetContent = ({
  searchQuery,
  setSearchQuery,
  isFullScreen,
  showRecentAndFilters,
  handleSearch,
  handleFocus,
  handleBlur,
  toggleTab,
  activeTab,
  translateX,
  gestureHandler,
  bottomSheetRef,
  marginTopAnim,
}: BottomSheetContentProps) => {
  const animatedStyles = useAnimatedStyle(() => ({
    marginTop: marginTopAnim.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <Animated.View className={"px-4 pt-6"} style={animatedStyles}>
      <TouchableOpacity
        onPress={handleSearch}
        className="flex-row items-center border border-gray-300 rounded-lg px-4 py-2"
      >
        <View className="flex-row gap-x-3 w-full items-center">
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
            className="flex-1 w-full"
            onChangeText={setSearchQuery}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </View>
      </TouchableOpacity>
      <AddMosqueButton />

      {/* Tabs */}
      {showRecentAndFilters && (
        <>
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
                <MosqueFilterComponent
                  afterFilterApplied={() => {
                    bottomSheetRef.current?.snapToIndex(0);
                  }}
                />
              )}
            </Animated.View>
          </PanGestureHandler>
        </>
      )}
    </Animated.View>
  );
};

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
