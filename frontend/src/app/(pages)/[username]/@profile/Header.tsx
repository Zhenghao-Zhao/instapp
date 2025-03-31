"use client";
import useFetchProfile from "@/app/_api/hooks/useFetchProfile";
import { useDataContext } from "@/app/_libs/contexts/providers/ServerContextProvider";
import ProfileChanger from "../_components/ProfileChanger";
import ProfileImage from "../_components/ProfileImage";
import FollowButton from "../_components/FollowButton";
import Modal from "@/app/_libs/contexts/providers/ModalContextProivder";
import { ModalContent, ModalTrigger } from "@/app/_components/ui/modal";
import FriendList from "../_components/FriendsList";

export default function Header({ username }: { username: string }) {
  const { data: profile, isPending } = useFetchProfile(username);
  const { authProfile } = useDataContext();
  const isOwner = authProfile.username == username;

  if (isPending) {
    return <p>pending</p>;
  }

  return (
    <header className="grid g-header-template border-b p-4 mb-4 justify-start items-center">
      <div className="area-profile">
        {isOwner ? (
          <ProfileChanger twSize="size-[110px] sm:size-profile-image-size" />
        ) : (
          <ProfileImage
            imageURL={profile.profileImageUrl}
            className="size-[110px] sm:size-profile-image-size"
          />
        )}
      </div>
      <p className="text-2xl font-bold area-name justify-self-start">
        {profile.name}
      </p>
      {!isOwner && (
        <FollowButton
          has_followed={profile.isFollowing}
          to_uid={profile.userUid}
          className="area-follow"
        />
      )}
      <div className="flex gap-[20px] items-center justify-between area-stats">
        <p>
          <span className="mr-2 font-bold">{profile.postCount}</span>
          posts
        </p>
        <Modal>
          <ModalTrigger>
            <button>
              <span className="mr-2 font-bold">{profile.followerCount}</span>
              followers
            </button>
          </ModalTrigger>
          <ModalContent>
            <FriendList uid={profile.userUid} friendship="followers" />
          </ModalContent>
        </Modal>
        <Modal>
          <ModalTrigger>
            <button>
              <span className="mr-2 font-bold">{profile.followeeCount}</span>
              following
            </button>
          </ModalTrigger>
          <ModalContent>
            <FriendList uid={profile.userUid} friendship="followees" />
          </ModalContent>
        </Modal>
      </div>
    </header>
  );
}
