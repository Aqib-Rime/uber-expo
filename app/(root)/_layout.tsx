import { useAuth, useUser } from "@clerk/clerk-expo";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Image, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";

const Layout = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/(auth)/sign-in");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          drawerStyle: {
            backgroundColor: "#f3f4f6",
            width: 280,
          },
          drawerType: "front",
          overlayColor: "rgba(0,0,0,0.5)",
          drawerLabelStyle: {
            fontFamily: "Jakarta-Medium",
            fontSize: 16,
          },
          drawerActiveTintColor: "#22c55e",
          drawerInactiveTintColor: "#4b5563",
        }}
        drawerContent={(props) => (
          <View style={{ flex: 1, padding: 20, marginTop: 30 }}>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Image
                source={{ uri: user?.imageUrl }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
              />
              <Text
                style={{
                  marginTop: 10,
                  fontFamily: "Jakarta-Bold",
                  fontSize: 18,
                }}
              >
                {user?.fullName}
              </Text>
              <Text style={{ color: "#6b7280", fontFamily: "Jakarta" }}>
                {user?.primaryEmailAddress?.emailAddress}
              </Text>
            </View>
            {props.state.routeNames.map((name, index) => {
              const isFocused = props.state.index === index;
              const onPress = () => {
                props.navigation.navigate(name);
              };

              if (name === "add-mosque" || name === "map-picker") return null;

              return (
                <TouchableOpacity
                  key={name}
                  onPress={onPress}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    padding: 16,
                    backgroundColor: isFocused ? "#e2e8f0" : "transparent",
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                >
                  {getIcon(name, isFocused)}
                  <Text
                    style={{
                      marginLeft: 16,
                      marginBottom: 6,
                      fontFamily: "Jakarta-Medium",
                      fontSize: 16,
                      color: isFocused ? "#22c55e" : "#4b5563",
                    }}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <View style={{ marginTop: "auto", marginBottom: 100 }}>
              <TouchableOpacity
                onPress={handleSignOut}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 16,
                  backgroundColor: "#f87171",
                  borderRadius: 12,
                }}
              >
                <Ionicons name="log-out" size={24} color="white" />
                <Text
                  style={{
                    marginLeft: 16,
                    marginBottom: 6,
                    fontFamily: "Jakarta-Medium",
                    fontSize: 16,
                    color: "white",
                  }}
                >
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      >
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

const getIcon = (routeName: string, isFocused: boolean) => {
  const color = isFocused ? "#22c55e" : "black";
  switch (routeName) {
    case "mosques":
      return <FontAwesome6 name="mosque" size={24} color={color} />;
    case "profile":
      return <Ionicons name="person" size={24} color={color} />;
    case "chat":
      return <Ionicons name="chatbubbles" size={24} color={color} />;
    default:
      return <Ionicons name="list" size={24} color={color} />;
  }
};

export default Layout;
