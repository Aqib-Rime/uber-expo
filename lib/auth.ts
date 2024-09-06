import {
  StartOAuthFlowParams,
  StartOAuthFlowReturnType,
} from "@clerk/clerk-expo";
import { UserResource } from "@clerk/types";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import ky from "ky";

import api, { clearBearerToken, setBearerToken } from "@/lib/apiClient";
import { User } from "@/types/mosque";

export const payloadAccessTokenKey = "payloadAccessToken";

export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (item) {
        console.log(`${key} was used 🔐 \n`);
      } else {
        console.log("No values stored under key: " + key);
      }
      return item;
    } catch (error) {
      console.error("SecureStore get item error: ", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export const googleOAuth = async (
  startOAuthFlow: (
    startOAuthFlowParams?: StartOAuthFlowParams | undefined,
  ) => Promise<StartOAuthFlowReturnType>,
) => {
  try {
    const { createdSessionId, setActive, signUp } = await startOAuthFlow({
      redirectUrl: Linking.createURL("/(root)/(tabs)/mosques"),
    });

    console.log({ createdSessionId });

    if (createdSessionId) {
      if (setActive) {
        await setActive!({ session: createdSessionId });
        return {
          success: true,
          code: "success",
          message: "You have successfully signed in with Google",
        };
      }
    } else {
      const response = await signUp?.update({
        username: signUp!.emailAddress!.split("@")[0],
      });
      if (response?.status === "complete") {
        await setActive!({ session: signUp!.createdSessionId });
        return {
          success: true,
          code: "success",
          message: "You have successfully signed in with Google",
        };
      }
    }

    return {
      success: false,
      message: "An error occurred while signing in with Google",
    };
  } catch (err: any) {
    console.error(err);
    return {
      success: false,
      code: err.code,
      message: err?.errors[0]?.longMessage,
    };
  }
};

type UserForToken = Omit<User, "updatedAt" | "createdAt" | "id">;

export const getAndSetAccessToken = async (
  clerkUser: UserResource,
  getToken: () => Promise<string | null>,
  authType?: User["creationWay"],
) => {
  console.log({
    username: clerkUser.username,
    email: clerkUser.emailAddresses,
  });
  if (!(clerkUser.username && clerkUser.emailAddresses.length > 0)) {
    clearBearerToken();
    return;
  }
  try {
    const token = await getToken();
    const { accessToken } = await ky
      .post("http://192.168.0.5:3000/api/getToken", {
        json: {
          username: clerkUser.username,
          email: clerkUser.emailAddresses[0].emailAddress,
          hasImage: clerkUser.hasImage,
          emailAddresses: clerkUser.emailAddresses.map((email) => ({
            email: email.emailAddress,
          })),
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          fullName: clerkUser.fullName,
          socialImageUrl: clerkUser.imageUrl,
          imageUrl: clerkUser.imageUrl,
          creationWay: authType || "email",
        } as UserForToken,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .json<{ accessToken: string }>();
    await tokenCache.saveToken(payloadAccessTokenKey, accessToken);
    setBearerToken(accessToken);
    console.log({ accessToken });
  } catch (e) {
    console.error(e);
  }
};
