"use client";
import ModalContent from "@/app/_components/ui/modal/ModalContent";
import ModalTrigger from "@/app/_components/ui/modal/ModalTrigger";
import { useDataContext } from "@/app/_contexts/providers/DataContextProvider";
import Modal from "@/app/_contexts/providers/ModalContextProivder";
import useFetchProfile from "@/app/_libs/hooks/api/mutations/useFetchProfile";
import FollowButton from "./FollowButton";
import FriendList from "./FriendsList";
import ProfileChanger from "./ProfileChanger";
import ProfileImage from "./ProfileImage";

export default function Profile({ username }: { username: string }) {
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
      <div className="area-name justify-self-start">
        <p className="text-2xl font-bold">{profile.username}</p>
        <p className="mt-2">{profile.name}</p>
      </div>
      {!isOwner && (
        <FollowButton
          isFollowing={profile.isFollowing}
          targetProfile={profile}
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
            <FriendList
              userId={profile.userId}
              followship="follower"
              title="Followers"
            />
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
            <FriendList
              userId={profile.userId}
              followship="followee"
              title="Followees"
            />
          </ModalContent>
        </Modal>
      </div>
    </header>
  );
}
