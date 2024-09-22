import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

const Page = () => {
  const { isSignedIn } = useAuth();

  if (isSignedIn) return <Redirect href="/mosques" />;

  return <Redirect href="/welcome" />;
};

export default Page;
