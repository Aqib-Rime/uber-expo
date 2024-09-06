import { MosqueFilterComponent } from "@/components/MosqueFacilitiesComponent";
import { useRecentSearches, useSearchQuery } from "@/store/mosqueFilterStore";
import { Feather, Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React from "react";
import { RefObject } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  GestureEvent,
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

interface BottomSheetContentProps {
  setSearchQuery: (query: string) => void;
  isFullScreen: boolean;
  showRecentAndFilters: boolean;
  handleFocus: () => void;
  handleBlur: () => void;
  toggleTab: () => void;
  activeTab: "recent" | "filter";
  translateX: SharedValue<number>;
  gestureHandler: (event: GestureEvent<PanGestureHandlerEventPayload>) => void;
  bottomSheetRef: RefObject<BottomSheet>;
  marginTopAnim: SharedValue<number>;
  searchComponent: React.ReactNode;
  onSearchBarFocus: () => void;
}

export const MosqueBottomSheetContent = ({
  setSearchQuery,
  isFullScreen,
  showRecentAndFilters,
  handleFocus,
  handleBlur,
  toggleTab,
  activeTab,
  translateX,
  gestureHandler,
  bottomSheetRef,
  marginTopAnim,
  searchComponent,
  onSearchBarFocus,
}: BottomSheetContentProps) => {
  const animatedStyles = useAnimatedStyle(() => ({
    marginTop: marginTopAnim.value,
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const searchQuery = useSearchQuery();
  const recentSearches = useRecentSearches();

  return (
    <Animated.View className={"px-4 pt-6"} style={animatedStyles}>
      {React.cloneElement(searchComponent as React.ReactElement, {
        onSearchBarFocus,
      })}
      {searchQuery.length <= 2 && <AddMosqueButton />}
      {/* Tabs */}
      {showRecentAndFilters &&
        searchQuery.length <= 2 && ( // Show tabs only if searchQuery length is 2 or less
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
                        <Animated.View key={search.id}>
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
  const router = useRouter();

  return (
    <View className="flex-row mt-2">
      <TouchableOpacity
        className="border-2 border-green-300 px-4 py-3 rounded-lg flex flex-1 flex-row bg-green-100 items-center justify-center"
        onPress={() => router.push("/(root)/add-mosque")}
      >
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
