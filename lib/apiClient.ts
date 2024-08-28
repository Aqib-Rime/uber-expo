import ky from "ky";

let bearerToken: string | null = null;

const api = ky.create({
  prefixUrl: process.env.EXPO_PUBLIC_API_URL!, // Replace with your actual API base URL
  timeout: 30000,
  hooks: {
    beforeRequest: [
      (request) => {
        request.headers.set("Content-Type", "application/json");
        request.headers.set("Accept", "application/json");

        if (bearerToken) {
          request.headers.set("Authorization", `Bearer ${bearerToken}`);
        }
      },
    ],
  },
});

export const fetchData = async <T>(url: string): Promise<T> => {
  try {
    const response: { docs: T } = await api.get(url).json();
    return response.docs;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export function setBearerToken(token: string) {
  bearerToken = token;
}

export function clearBearerToken() {
  bearerToken = null;
}

export function getBearerToken(): string | null {
  return bearerToken;
}

export default api;
