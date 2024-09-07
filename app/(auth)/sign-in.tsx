import { useSignIn } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

import { FormErrorMessage } from "@/app/(auth)/sign-up";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { images } from "@/constants";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignIn = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignInPress = useCallback(
    async (data: SignInFormData) => {
      if (!isLoaded) return;

      try {
        const signInAttempt = await signIn.create({
          identifier: data.email,
          password: data.password,
        });

        if (signInAttempt.status === "complete") {
          await setActive({ session: signInAttempt.createdSessionId });
        } else {
          Alert.alert("Error", "Log in failed. Please try again.");
        }
      } catch (err: any) {
        Alert.alert("Error", err.errors[0].longMessage);
      }
    },
    [isLoaded, signIn, setActive]
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Assalamu alaikum 👋
          </Text>
        </View>

        <View className="p-5 flex flex-col gap-y-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Email"
                placeholder="Enter email"
                icon={<Ionicons name="mail" size={24} color="gray" />} // Updated icon
                textContentType="emailAddress"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email && <FormErrorMessage message={errors.email.message} />}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Password"
                placeholder="Enter password"
                icon={<Ionicons name="lock-closed" size={24} color="gray" />} // Updated icon
                secureTextEntry={true}
                textContentType="password"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.password && (
            <FormErrorMessage message={errors.password.message} />
          )}

          <CustomButton
            title="Sign In"
            onPress={handleSubmit(onSignInPress)}
            className="mt-6"
          />

          <OAuth />

          <Link
            href="/sign-up"
            className="text-lg text-center text-general-200 mt-10"
          >
            Don't have an account?{" "}
            <Text className="text-primary-500">Sign Up</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
