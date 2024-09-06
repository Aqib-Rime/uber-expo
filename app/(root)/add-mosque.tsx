import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import StepIndicator from "react-native-step-indicator";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "react-native-safe-area-context";

const schema = z.object({
  name: z.string().min(1, "Mosque name is required"),
  address: z.string().min(1, "Address is required"),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  facilities: z.array(z.string()),
  comment: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const steps = ["Basic Info", "Location", "Images"];

export default function AddMosquePage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [otherImages, setOtherImages] = useState<string[]>([]);
  const [alreadySetFromMapPicker, setAlreadySetFromMapPicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      facilities: [],
      comment: "",
    },
  });

  React.useEffect(() => {
    if (params.address && params.latitude && params.longitude) {
      setValue("address", params.address as string);
      setValue("latitude", params.latitude as string);
      setValue("longitude", params.longitude as string);

      // Set the current step to the returnStep if it exists
      if (params.returnStep && !alreadySetFromMapPicker) {
        console.log("returnStep", params.returnStep);
        setCurrentStep(parseInt(params.returnStep as string, 10));
        setAlreadySetFromMapPicker(true);
      }
    }
  }, [params, setValue]);

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", { ...data, coverImage, otherImages });
    router.back();
  };

  const pickImage = async (isMultiple = false) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: isMultiple,
      quality: 1,
    });

    if (!result.canceled) {
      if (isMultiple) {
        setOtherImages(result.assets.map((asset) => asset.uri));
      } else {
        setCoverImage(result.assets[0].uri);
      }
    }
  };

  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: "#22c55e",
    stepStrokeWidth: 2,
    stepStrokeFinishedColor: "#22c55e",
    stepStrokeUnFinishedColor: "#DEDEDE",
    separatorFinishedColor: "#22c55e",
    separatorUnFinishedColor: "#DEDEDE",
    stepIndicatorFinishedColor: "#22c55e",
    stepIndicatorUnFinishedColor: "#ffffff",
    stepIndicatorCurrentColor: "#ffffff",
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: "#22c55e",
    stepIndicatorLabelFinishedColor: "#ffffff",
    stepIndicatorLabelUnFinishedColor: "#999999",
    labelColor: "#999999",
    labelSize: 13,
    currentStepLabelColor: "#22c55e",
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <View>
            <Text className="text-lg font-semibold mb-2 text-slate-600">
              Mosque Name
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-white p-4 rounded-lg mb-4 border border-gray-200"
                  placeholder="Enter mosque name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="name"
            />
            {errors.name && (
              <Text className="text-red-500 mb-4">{errors.name.message}</Text>
            )}
          </View>
        );
      case 1:
        return (
          <View>
            <TouchableOpacity
              className="bg-white p-4 rounded-lg mb-4 items-center flex-row justify-center border border-gray-200 shadow-sm"
              onPress={() => {
                setAlreadySetFromMapPicker(false);
                return router.push({
                  pathname: "/(root)/map-picker",
                  params: {
                    onSelect: "/(root)/add-mosque",
                    returnStep: currentStep.toString(), // Pass the current step
                  },
                });
              }}
            >
              <Ionicons
                name="map-outline"
                size={24}
                color="#22c55e"
                style={{ marginRight: 8 }}
              />
              <Text className="text-green-500 font-semibold">
                {params.address ? "Change Location" : "Pick Location on Map"}
              </Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold mb-2 text-slate-600">
              Address
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-white p-4 rounded-lg mb-4 border border-gray-200"
                  placeholder="Enter mosque address"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                />
              )}
              name="address"
            />
            {errors.address && (
              <Text className="text-red-500 mb-4">
                {errors.address.message}
              </Text>
            )}
            <Text className="text-lg font-semibold mb-2 text-slate-600">
              Latitude
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-white p-4 rounded-lg mb-4 border border-gray-200"
                  placeholder="Latitude"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={false}
                />
              )}
              name="latitude"
            />
            <Text className="text-lg font-semibold mb-2 text-slate-600">
              Longitude
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-white p-4 rounded-lg mb-4 border border-gray-200"
                  placeholder="Longitude"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={false}
                />
              )}
              name="longitude"
            />
          </View>
        );
      case 2:
        return (
          <View>
            <Text className="text-lg font-semibold mb-2 text-slate-600">
              Cover Image
            </Text>
            <TouchableOpacity
              className="bg-white p-4 rounded-lg mb-4 items-center flex-row justify-center border border-gray-200 shadow-sm"
              onPress={() => pickImage()}
            >
              <Ionicons
                name="cloud-upload-outline"
                size={24}
                color="#22c55e"
                style={{ marginRight: 8 }}
              />
              <Text className="text-green-500 font-semibold">
                Upload Cover Image
              </Text>
            </TouchableOpacity>
            {coverImage && (
              <Image
                source={{ uri: coverImage }}
                className="w-full h-40 rounded-lg mb-4"
              />
            )}

            <Text className="text-lg font-semibold mb-2 text-slate-600">
              Other Images
            </Text>
            <TouchableOpacity
              className="bg-white p-4 rounded-lg mb-4 items-center flex-row justify-center border border-gray-200 shadow-sm"
              onPress={() => pickImage(true)}
            >
              <Ionicons
                name="images-outline"
                size={24}
                color="#22c55e"
                style={{ marginRight: 8 }}
              />
              <Text className="text-green-500 font-semibold">
                Upload Other Images
              </Text>
            </TouchableOpacity>
            <ScrollView horizontal className="mb-4">
              {otherImages.map((uri, index) => (
                <Image
                  key={index}
                  source={{ uri }}
                  className="w-20 h-20 rounded-lg mr-2"
                />
              ))}
            </ScrollView>

            <Text className="text-lg font-semibold mb-2 text-slate-600">
              Comment
            </Text>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-white p-4 rounded-lg mb-4 border border-gray-200"
                  placeholder="Your comment about the mosque"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  multiline
                />
              )}
              name="comment"
            />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row mt-3 items-center justify-start gap-x-4 px-4">
        <TouchableOpacity
          className="bg-white border border-gray-200 p-2 rounded-full shadow-md"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#22c55e" />
        </TouchableOpacity>
        <Text className="ml-2 font-semibold text-slate-600 text-3xl">
          Add Mosque
        </Text>
      </View>
      <View className="py-4 px-4 mt-4">
        <StepIndicator
          customStyles={customStyles}
          currentPosition={currentStep}
          labels={steps}
          stepCount={steps.length}
          onPress={(position: number) => setCurrentStep(position)}
        />
      </View>
      <ScrollView className="flex-1 px-4 py-6 mb-10">
        {renderStepContent()}
      </ScrollView>
      <View className="flex-row justify-between p-4">
        {currentStep === 0 ? (
          <TouchableOpacity
            className="px-6 py-3 rounded-lg flex-1 mr-2 items-center justify-center border-2 border-red-300"
            onPress={() => router.back()}
          >
            <Text className="font-semibold text-md text-red-500">Cancel</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="px-6 py-3 rounded-lg flex-1 mr-2 items-center justify-center border-2 border-green-300"
            onPress={() => setCurrentStep(currentStep - 1)}
          >
            <Text className="font-semibold text-md text-green-500">Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="px-6 py-3 rounded-lg flex-1 ml-2 items-center justify-center border-2 border-green-300 bg-green-100"
          onPress={
            currentStep === steps.length - 1
              ? handleSubmit(onSubmit)
              : () => setCurrentStep(currentStep + 1)
          }
        >
          <Text className="font-semibold text-md text-green-500">
            {currentStep === steps.length - 1 ? "Submit" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
