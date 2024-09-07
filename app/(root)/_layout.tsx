import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="mosques"
          options={{
            drawerLabel: "Mosques",
            title: "Mosques",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "Profile",
            title: "Profile",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="chat"
          options={{
            drawerLabel: "Chat",
            title: "Chat",
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="add-mosque"
          options={{ drawerItemStyle: { display: "none" }, headerShown: false }}
        />
        <Drawer.Screen
          name="map-picker"
          options={{
            drawerItemStyle: { display: "none" },
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
};

export default Layout;
