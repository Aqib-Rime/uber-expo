import React from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Mosque } from "@/types/mosque";

type MosqueMarkerProps = {
  mosque: Mosque;
  onPress: () => void;
};

export const MosqueMarker: React.FC<MosqueMarkerProps> = ({
  mosque,
  onPress,
}) => (
  <Marker
    coordinate={{
      latitude: mosque.position[1],
      longitude: mosque.position[0],
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons
        name="map-marker-radius"
        size={28}
        color="white"
      />
    </View>
  </Marker>
);
