import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="add-mosque" />
      <Stack.Screen
        name="map-picker"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
};

export default Layout;
