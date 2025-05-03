import { fromError } from "@/app/_libs/utils";
import { ProfileSchema } from "@/app/_libs/vars/schemas";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "next/navigation";
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

  if (query.error) {
    const apiError = fromError(query.error);
    if (apiError.status === 404) {
      notFound();
    }
    throw Error(apiError.message);
  }

  return query;
}

const getUserProfile = async (username: string) => {
  const result = await clientApi.get(`${username}/profile`);
  return ProfileSchema.parse(result.data.data);
};
