import { useAuth, useSignUp, useUser } from "@clerk/clerk-expo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Image, ScrollView, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";
import { z } from "zod";

import { LoginBackend } from "@/app/(test)/_compoents/loginBackend";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { getAndSetAccessToken } from "@/lib/auth";
import { fetchAPI } from "@/lib/fetch";
import { Ionicons } from "@expo/vector-icons";

const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [clerkError, setClerkError] = useState("");

  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSignUpPress = async (data: SignUpFormData) => {
    if (!isLoaded) return;
    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      setClerkError(err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });
      if (completeSignUp.status === "complete") {
        await fetchAPI("/(api)/user", {
          method: "POST",
          body: JSON.stringify({
            name: completeSignUp.firstName,
            email: completeSignUp.emailAddress,
            clerkId: completeSignUp.createdUserId,
          }),
        });
        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({
          ...verification,
          state: "success",
        });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed. Please try again.",
          state: "failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.errors[0].longMessage,
        state: "failed",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image source={images.signUpCar} className="z-0 w-full h-[250px]" />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Create Your Account
          </Text>
        </View>
        {/* <LoginBackend /> */}
        <View className="p-5">
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <View>
                <InputField
                  label="Name"
                  placeholder="Enter name"
                  icon={<Ionicons name="person" size={24} color="gray" />}
                  value={value}
                  onChangeText={onChange}
                />
                {errors.name ? (
                  <FormErrorMessage message={errors.name.message} />
                ) : null}
              </View>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Email"
                placeholder="Enter email"
                icon={<Ionicons name="mail" size={24} color="gray" />}
                textContentType="emailAddress"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.email ? (
            <FormErrorMessage message={errors.email.message} />
          ) : null}

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <InputField
                label="Password"
                placeholder="Enter password"
                icon={<Ionicons name="key" size={24} color="gray" />}
                secureTextEntry={true}
                textContentType="password"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.password ? (
            <FormErrorMessage message={errors.password.message} />
          ) : null}

          <CustomButton
            title="Sign Up"
            onPress={handleSubmit(onSignUpPress)}
            className="mt-6"
          />
          <OAuth />
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Already have an account? </Text>
            <Text className="text-primary-500">Log In</Text>
          </Link>
        </View>
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="font-JakartaExtraBold text-2xl mb-2">
              Verification
            </Text>
            <Text className="font-Jakarta mb-5">
              We've sent a verification code to your email.
            </Text>
            <InputField
              label={"Code"}
              icon={<Ionicons name="key" size={24} color="gray" />}
              placeholder={"12345"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            {verification.error && (
              <Text className="text-red-500 text-sm mt-1">
                {verification.error}
              </Text>
            )}
            <CustomButton
              title="Verify Email"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={showSuccessModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            />
            <Text className="text-3xl font-JakartaBold text-center">
              Verified
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              You have successfully verified your account.
            </Text>
            <CustomButton
              title="Browse Home"
              onPress={() => {
                if (user) {
                  getAndSetAccessToken(user, getToken, "email");
                }
                router.push(`/(root)/mosques`);
              }}
              className="mt-5"
            />
          </View>
        </ReactNativeModal>
        <ReactNativeModal isVisible={clerkError.length > 0}>
          <View className="px-7 py-9 rounded-2xl min-h-[300px] border-2 border-red-500 bg-red-100">
            <Text className="font-JakartaExtraBold text-2xl mb-2 text-red-500">
              Authentication Error
            </Text>
            <Text className="font-Jakarta text-red-500 text-sm mb-5">
              {clerkError}
            </Text>
            <View className={"flex flex-col flex-1 items-center"} />
            <CustomButton
              title="Try Again"
              onPress={() => setClerkError("")}
              className="bg-red-500 border-2 border-red-500"
            />
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SignUp;

export function FormErrorMessage({ message }: { message?: string }) {
  return (
    <View
      className={"p-1 bg-red-100 rounded-full px-4 flex flex-row items-center"}
    >
      {message ? (
        <Text className="text-red-500 text-sm mb-0.5">{message}</Text>
      ) : null}
    </View>
  );
}
