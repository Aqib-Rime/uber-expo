import React, { useCallback } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { debounce } from "lodash";
import { Ionicons, FontAwesome6 } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import {
  useMosqueFilterStore,
  useSearchQuery,
} from "@/store/mosqueFilterStore";
import { fetchPlaceSuggestions } from "@/api/googlePlacesApi";

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

interface Suggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GoogleSearchProps {
  onSelectPlace: (suggestion: Suggestion) => void;
}

const fetchSuggestions = async (input: string): Promise<Suggestion[]> => {
  return fetchPlaceSuggestions(input);
};

export const GoogleSearch: React.FC<GoogleSearchProps> = ({
  onSelectPlace,
}) => {
  const searchQuery = useSearchQuery();
  const setSearchQuery = useMosqueFilterStore((state) => state.setSearchQuery);
  const addRecentSearch = useMosqueFilterStore(
    (state) => state.addRecentSearch
  );

  const { data: suggestions = [], refetch } = useQuery<Suggestion[]>({
    queryKey: ["suggestions", searchQuery],
    queryFn: () => fetchSuggestions(searchQuery),
    enabled: false, // We'll manually trigger the query
  });

  const debouncedRefetch = useCallback(
    debounce(() => refetch(), 300),
    [refetch]
  );

  const handleInputChange = (text: string): void => {
    setSearchQuery(text);
    if (text.length > 2) {
      debouncedRefetch();
    }
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    addRecentSearch({
      id: suggestion.place_id,
      name: suggestion.structured_formatting.main_text,
      location: suggestion.structured_formatting.secondary_text,
    });
    onSelectPlace(suggestion);
  };

  return (
    <View className="w-full">
      <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-2">
        <Ionicons name="search" size={20} color="#22c55e" />
        <TextInput
          className="flex-1 ml-2"
          placeholder="Search nearby mosques"
          value={searchQuery}
          onChangeText={handleInputChange}
        />
      </View>
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item, index }) => (
            <View>
              <TouchableOpacity
                className="py-2 flex-row items-center"
                onPress={() => handleSelectSuggestion(item)}
              >
                <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-4">
                  <FontAwesome6 name="location-dot" size={16} color="#22c55e" />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-500 font-semibold text-md mb-0.5">
                    {item.structured_formatting.main_text}
                  </Text>
                  <Text className="text-slate-400 text-sm">
                    {item.structured_formatting.secondary_text}
                  </Text>
                </View>
              </TouchableOpacity>
              {index < suggestions.length - 1 && (
                <View className="flex-row">
                  <View className="w-12" />
                  <View className="flex-1 h-px bg-gray-200" />
                </View>
              )}
            </View>
          )}
          className="mt-2 bg-white rounded-lg shadow-md"
        />
      )}
    </View>
  );
};
