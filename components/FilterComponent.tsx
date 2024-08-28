import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

export function FilterComponent() {
  const [filter, setFilter] = useState<string>("");

  return (
    <View className="flex flex-row items-center justify-between">
      {/*<TextInput*/}
      {/*  className="border-2 border-white bg-gray-200 rounded-2xl px-4 py-4 mb-4 w-full"*/}
      {/*  placeholder="Search..."*/}
      {/*  value={filter}*/}
      {/*  onChangeText={setFilter}*/}
      {/*/>*/}
      {/*<TouchableOpacity*/}
      {/*  className={*/}
      {/*    "bg-white p-3 rounded-full flex flex-row items-center justify-center"*/}
      {/*  }*/}
      {/*>*/}
      {/*  <AntDesign name="filter" size={24} color="black" />*/}
      {/*</TouchableOpacity>*/}
    </View>
  );
}
