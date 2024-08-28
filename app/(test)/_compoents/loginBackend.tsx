import { useMutation } from "@tanstack/react-query";
import { Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import api from "@/lib/apiClient";
import { User } from "@/types/mosque";

export function LoginBackend() {
  const { mutate, data, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const resp = await api
        .post("users/login", {
          json: {
            email,
            password,
          },
        })
        .json<{
          message: string;
          exp: number;
          token: string;
          user: User;
        }>();
      return resp;
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  if (isPending) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <CustomButton
        title="Test"
        onPress={() =>
          mutate({
            email: "aqibrime@gmail.com",
            password: "test123",
          })
        }
        className="mt-5"
      />
      <Text>{JSON.stringify(data, null, 2)}</Text>
    </View>
  );
}
