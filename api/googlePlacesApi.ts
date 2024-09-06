const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

interface PlaceSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface PlaceDetails {
  result: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  };
}

export const fetchPlaceSuggestions = async (
  input: string
): Promise<PlaceSuggestion[]> => {
  if (input.length <= 2) return [];
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${API_KEY}&types=mosque`
  );
  const data: { predictions: PlaceSuggestion[] } = await response.json();
  return data.predictions;
};

export const fetchPlaceDetails = async (
  placeId: string
): Promise<{ lat: number; lng: number }> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${API_KEY}`
  );
  const data: PlaceDetails = await response.json();
  return data.result.geometry.location;
};
