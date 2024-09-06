import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type SkeletonPlaceholderProps = {
  className?: string;
  style?: object;
};

function SkeletonPlaceholder(props: SkeletonPlaceholderProps) {
  return (
    <View
      className={`w-full ${props.className || ""}`}
      style={{ ...props.style, backgroundColor: "rgba(0,0,0,0.1)" }}
    />
  );
}

export function SkeletonLoading() {
  return (
    <View className="px-2 h-full rounded-lg shadow-md flex flex-col gap-y-2">
      {/* ... (keep the existing JSX for SkeletonLoading) */}
    </View>
  );
}
