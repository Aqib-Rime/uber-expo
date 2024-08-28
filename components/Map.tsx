import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";

// import MapViewDirections from "react-native-maps-directions";
import { icons } from "@/constants";
import { useFilteredMosques } from "@/hooks/mosques";
import { fetchData } from "@/lib/apiClient";
import { calculateDriverTimes, calculateRegion } from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { Mosque } from "@/types/mosque";
import { MarkerData } from "@/types/type";

// const directionsAPI = process.env.EXPO_PUBLIC_DIRECTIONS_API_KEY;

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();
  // const { selectedDriver, setDrivers } = useDriverStore();

  const { mosques, isLoading, isError } = useFilteredMosques();

  mosques?.forEach((mosque, idx) => {
    console.log(mosque.position, idx);
  });

  // useEffect(() => {
  //   if (Array.isArray(drivers)) {
  //     if (!userLatitude || !userLongitude) return;
  //
  //     const newMarkers = generateMarkersFromData({
  //       data: drivers,
  //       userLatitude,
  //       userLongitude,
  //     });
  //
  //     setMarkers(newMarkers);
  //   }
  // }, [drivers, userLatitude, userLongitude]);

  // useEffect(() => {
  //   if (
  //     markers.length > 0 &&
  //     destinationLatitude !== undefined &&
  //     destinationLongitude !== undefined
  //   ) {
  //     calculateDriverTimes({
  //       markers,
  //       userLatitude,
  //       userLongitude,
  //       destinationLatitude,
  //       destinationLongitude,
  //     }).then((drivers) => {
  //       setDrivers(drivers as MarkerData[]);
  //     });
  //   }
  // }, [markers, destinationLatitude, destinationLongitude]);

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  if (isLoading || (!userLatitude && !userLongitude))
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );

  if (isError)
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {"Error"}</Text>
      </View>
    );

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="standard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
      onMarkerPress={({ nativeEvent }) => {
        console.log(nativeEvent.coordinate);
      }}
    >
      {(mosques ?? []).map((mosque) => (
        <Marker
          key={mosque.id}
          coordinate={{
            latitude: mosque.position[1],
            longitude: mosque.position[0],
          }}
          title={mosque.name}
        />
      ))}

      {/*{destinationLatitude && destinationLongitude && (*/}
      {/*  <>*/}
      {/*    <Marker*/}
      {/*      key="destination"*/}
      {/*      coordinate={{*/}
      {/*        latitude: destinationLatitude,*/}
      {/*        longitude: destinationLongitude,*/}
      {/*      }}*/}
      {/*      title="Destination"*/}
      {/*      image={icons.pin}*/}
      {/*    />*/}
      {/*    /!*<MapViewDirections*!/*/}
      {/*    /!*  origin={{*!/*/}
      {/*    /!*    latitude: userLatitude!,*!/*/}
      {/*    /!*    longitude: userLongitude!,*!/*/}
      {/*    /!*  }}*!/*/}
      {/*    /!*  destination={{*!/*/}
      {/*    /!*    latitude: destinationLatitude,*!/*/}
      {/*    /!*    longitude: destinationLongitude,*!/*/}
      {/*    /!*  }}*!/*/}
      {/*    /!*  apikey={directionsAPI!}*!/*/}
      {/*    /!*  strokeColor="#0286FF"*!/*/}
      {/*    /!*  strokeWidth={2}*!/*/}
      {/*    /!*/
      /*/}
      {/*  </>*/}
      {/*)}*/}
    </MapView>
  );
};

export default Map;
