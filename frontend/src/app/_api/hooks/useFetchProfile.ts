import { ProfileSchema } from "@/app/_libs/types";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "../axios";

export default function useFetchProfile(username: string) {
  const query = useQuery({
    queryKey: ["userProfile", username],
    queryFn: ({ queryKey }) => {
      const [_, username] = queryKey;
      return getUserProfile(username);
    },
    staleTime: 1000 * 60 * 60 * 8,
    retry: 1,
  });

  if (!query.data || query.error) {
    throw new Error("Failed to retrieve user profile, please try again later");
  }

  return query;
}

const getUserProfile = async (uid: string) => {
  const result = await clientApi.get(`${uid}/profile`);
  return ProfileSchema.parse(result.data.payload);
};
