import React, { useState } from "react";
import { View, TextInput } from "react-native";

export const GoogleSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    // Implement search functionality here
  };

  return (
    <View className="p-4 flex flex-row items-center">
      <TextInput
        className="border-2 border-white bg-gray-200 rounded-2xl px-4 py-4 mb-4 w-full"
        placeholder="Search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );
};
