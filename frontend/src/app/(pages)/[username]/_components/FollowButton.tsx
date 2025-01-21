import Throbber from "@/app/_components/ui/loaders";
import { handleToggleFollow } from "@/app/_libs/api/mutations";
import { useDataContext } from "@/app/_libs/contexts/providers/ServerContextProvider";
import { Profile } from "@/app/_libs/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ButtonHTMLAttributes, useState } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  has_followed: boolean;
  to_uid: string;
  className?: string;
}

export default function FollowButton({
  has_followed,
  to_uid,
  className,
  ...props
}: Props) {
  const queryClient = useQueryClient();
  const { data: serverData } = useDataContext();
  const [isFollowing, setIsFollowing] = useState(has_followed);
  const from_uid = serverData.profile.uid;
  const { mutate, isPending } = useMutation({
    mutationFn: handleToggleFollow,
    onSuccess: async (data) => {
      const has_followed = data.data.has_followed;
      const from_prevData = queryClient.getQueryData<Profile>([
        "userProfile",
        from_uid,
      ]);
      const to_prevData = queryClient.getQueryData<Profile>([
        "userProfile",
        to_uid,
      ]);

      if (from_prevData) {
        const from_followeeCount =
          from_prevData.followee_count + (has_followed ? 1 : -1);

        queryClient.setQueryData(["userProfile", from_uid], {
          ...from_prevData,
          followee_count: from_followeeCount,
        });
      }

      if (to_prevData) {
        const to_followerCount =
          to_prevData.follower_count + (has_followed ? 1 : -1);

        queryClient.setQueryData(["userProfile", to_uid], {
          ...to_prevData,
          follower_count: to_followerCount,
          has_followed,
        });
      }

      setIsFollowing((prev) => !prev);
    },
  });
  const handleClick = () => {
    mutate({ uid: to_uid, to_follow: !isFollowing });
  };
  return (
    <button
      className={twMerge("bg-blue-500 text-white p-2 rounded-md", className)}
      onClick={handleClick}
      disabled={isPending}
      {...props}
    >
      {isPending ? <Throbber /> : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
