import Throbber from "@/app/_components/ui/loaders/Throbber";
import useToggleFollow from "@/app/_libs/hooks/api/mutations/useToggleFollow";
import { User } from "@/app/_libs/vars/types";
import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  isFollowing: boolean;
  targetProfile: User;
  className?: string;
}

export default function FollowButton({
  isFollowing,
  targetProfile,
  className,
  ...props
}: Props) {
  const { mutate, isPending } = useToggleFollow(targetProfile.username);
  const handleClick = () => {
    mutate({ targetId: targetProfile.userId, willFollow: !isFollowing });
  };
  return (
    <button
      className={twMerge("bg-blue-500 p-2 rounded-md text-white", className)}
      onClick={handleClick}
      disabled={isPending}
      {...props}
    >
      {isPending ? <Throbber /> : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
