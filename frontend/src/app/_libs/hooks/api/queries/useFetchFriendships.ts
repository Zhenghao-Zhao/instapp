import { FriendshipPayloadSchema } from "@/app/_libs/vars/schemas";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "../axios";

export default function useFetchFriendships(ids: string[]) {
  const query = useQuery({
    queryKey: ["friendships", ids],
    queryFn: () => getFriendships(ids),
  });

  return query;
}

const getFriendships = async (userIds: string[]) => {
  const result = await clientApi.post("friendships", {
    userIds,
  });
  return FriendshipPayloadSchema.parse(result.data.data);
};
