import { useDataContext } from "@/app/_contexts/providers/DataContextProvider";
import { FriendshipPayload, Profile } from "@/app/_libs/vars/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { clientApi } from "../axios";

export default function useToggleFollow(targetUsername: string) {
  const queryClient = useQueryClient();
  const { authProfile } = useDataContext();
  const mutation = useMutation({
    mutationFn: handleToggleFollow,
    onMutate: async (data) => {
      const fromPrevData = queryClient.getQueryData<Profile>([
        "userProfile",
        authProfile.username,
      ]);
      const toPrevData = queryClient.getQueryData<Profile>([
        "userProfile",
        targetUsername,
      ]);

      const friendshipData = queryClient.getQueriesData<FriendshipPayload>({
        queryKey: ["friendships"],
      });

      if (fromPrevData) {
        const fromFolloweeCount =
          fromPrevData.followeeCount + (data.willFollow ? 1 : -1);

        queryClient.setQueryData(["userProfile", authProfile.username], {
          ...fromPrevData,
          followeeCount: fromFolloweeCount,
        });
      }

      if (toPrevData) {
        const toFollowerCount =
          toPrevData.followerCount + (data.willFollow ? 1 : -1);

        queryClient.setQueryData(["userProfile", targetUsername], {
          ...toPrevData,
          followerCount: toFollowerCount,
          isFollowing: data.willFollow,
        });
      }

      if (friendshipData) {
        queryClient.setQueriesData<FriendshipPayload>(
          { queryKey: ["friendships"] },
          (old) => {
            return {
              ...old,
              [data.targetId]: { isFollowing: data.willFollow },
            };
          },
        );
      }

      return { fromPrevData, toPrevData, friendshipData };
    },
    onError: (error, _variables, _context) => {
      console.log(error);
      toast.error("Request failed, please try again later");
      queryClient.invalidateQueries({ queryKey: ["friendships"] });
    },
  });

  return mutation;
}

export function handleToggleFollow({
  targetId,
  willFollow,
}: {
  targetId: string;
  willFollow: boolean;
}) {
  return willFollow
    ? clientApi.post(`friend/${targetId}/add`)
    : clientApi.post(`friend/${targetId}/remove`);
}
