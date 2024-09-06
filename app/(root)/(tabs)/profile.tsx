import { useAuth, useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";

const Profile = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.primaryEmailAddress?.emailAddress || "",
    phone: user?.primaryPhoneNumber?.phoneNumber || "",
  });

  const handleEdit = () => {
    if (isEditing) {
      // Save changes to user profile
      console.log("Saving user data:", userData);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData({ ...userData, [field]: value });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="px-6"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row justify-between items-center my-8">
          <Text className="text-3xl font-bold text-gray-800">My Profile</Text>
          <TouchableOpacity
            onPress={handleEdit}
            className={`px-4 py-2 rounded-full ${
              isEditing ? "bg-green-500" : "bg-primary-500"
            }`}
          >
            <Text className="text-white font-semibold">
              {isEditing ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex items-center justify-center mb-10">
          <View className="relative">
            <Image
              source={{
                uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
              }}
              style={{ width: 150, height: 150, borderRadius: 75 }}
              className="border-4 border-white shadow-2xl"
            />
            <TouchableOpacity
              className="absolute bottom-0 right-0 bg-primary-500 p-2 rounded-full"
              onPress={() => console.log("Change profile picture")}
            >
              <MaterialCommunityIcons name="camera" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="mt-4 text-2xl font-JakartaBold text-gray-800">
            {`${user?.firstName} ${user?.lastName}`}
          </Text>
          <Text className="text-gray-500 font-JakartaMedium">
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        <InputField
          label="First name"
          value={userData.firstName}
          onChangeText={(text) => handleInputChange("firstName", text)}
          editable={isEditing}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color={isEditing ? "#4B5563" : "#9CA3AF"}
            />
          }
          inputStyle={isEditing ? "text-gray-800" : "text-gray-500"}
          containerStyle={isEditing ? "bg-gray-100" : "bg-gray-50"}
        />

        <InputField
          label="Last name"
          value={userData.lastName}
          onChangeText={(text) => handleInputChange("lastName", text)}
          editable={isEditing}
          icon={
            <Ionicons
              name="person-outline"
              size={20}
              color={isEditing ? "#4B5563" : "#9CA3AF"}
            />
          }
          inputStyle={isEditing ? "text-gray-800" : "text-gray-500"}
          containerStyle={isEditing ? "bg-gray-100" : "bg-gray-50"}
        />

        <InputField
          label="Email"
          value={userData.email}
          onChangeText={(text) => handleInputChange("email", text)}
          editable={isEditing}
          icon={
            <Ionicons
              name="mail-outline"
              size={20}
              color={isEditing ? "#4B5563" : "#9CA3AF"}
            />
          }
          inputStyle={isEditing ? "text-gray-800" : "text-gray-500"}
          containerStyle={isEditing ? "bg-gray-100" : "bg-gray-50"}
        />

        <InputField
          label="Phone"
          value={userData.phone}
          onChangeText={(text) => handleInputChange("phone", text)}
          editable={isEditing}
          icon={
            <Ionicons
              name="call-outline"
              size={20}
              color={isEditing ? "#4B5563" : "#9CA3AF"}
            />
          }
          inputStyle={isEditing ? "text-gray-800" : "text-gray-500"}
          containerStyle={isEditing ? "bg-gray-100" : "bg-gray-50"}
        />

        <CustomButton
          onPress={async () => {
            await signOut();
            router.replace("/(auth)/sign-in");
          }}
          title="Sign Out"
          className="bg-red-500 text-white mt-8 py-4 rounded-full shadow-md"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
