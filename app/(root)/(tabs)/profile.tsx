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
          <View className="flex-row items-center">
            <View className="relative">
              <Image
                source={{
                  uri: user?.externalAccounts[0]?.imageUrl ?? user?.imageUrl,
                }}
                style={{ width: 80, height: 80, borderRadius: 40 }}
                className="border-2 border-white shadow-lg"
              />
              <TouchableOpacity
                className="absolute bottom-0 right-0 bg-primary-500 p-1 rounded-full"
                onPress={() => console.log("Change profile picture")}
              >
                <MaterialCommunityIcons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            <View className="ml-4">
              <Text className="text-xl font-JakartaBold text-gray-800">
                {`${user?.firstName} ${user?.lastName}`}
              </Text>
              <Text className="text-sm text-gray-500 font-JakartaMedium">
                {user?.primaryEmailAddress?.emailAddress}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={handleEdit}
            className={`px-4 py-2 rounded-full ${
              isEditing ? "bg-green-500" : "bg-primary-500"
            }`}
          >
            <Text className="text-white mb-1 font-JakartaSemiBold">
              {isEditing ? "Save" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-6">
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
        </View>

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
