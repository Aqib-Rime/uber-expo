import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="find-ride" options={{ headerShown: false }} />
      <Stack.Screen
        name="confirm-ride"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="book-ride"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="add-mosque"
        options={{
          presentation: "modal",
          title: "Add Mosque",
          headerStyle: {
            backgroundColor: "#22c55e",
          },
          headerTintColor: "#fff",
        }}
      />
      <Stack.Screen
        name="map-picker"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default Layout;
