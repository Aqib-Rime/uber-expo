import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import { KeyboardAvoidingView } from "react-native";

import { InputFieldProps } from "@/types/type";

const InputField = ({
  label,
  icon,
  secureTextEntry = false,
  labelStyle,
  containerStyle,
  inputStyle,
  iconStyle,
  className,
  ...props
}: InputFieldProps) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="w-full mb-4">
          <Text
            className={`text-sm font-JakartaSemiBold mb-2 text-gray-700 ${labelStyle}`}
          >
            {label}
          </Text>
          <View
            className={`flex-row items-center bg-gray-100 rounded-xl border border-gray-200 ${containerStyle}`}
          >
            {icon && <View className="pl-4 pr-2">{icon}</View>}
            <TextInput
              className={`flex-1 py-3 mb-1 px-2 font-JakartaMedium text-[16px] text-gray-800 ${inputStyle}`}
              secureTextEntry={secureTextEntry}
              placeholderTextColor="#9CA3AF"
              {...props}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
