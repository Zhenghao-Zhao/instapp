import FollowButton from "@/app/(pages)/[username]/_components/FollowButton";
import ProfileImage from "@/app/(pages)/[username]/_components/ProfileImage";
import InfiniteScrollLoader from "@/app/_components/common/InfiniteScrollLoader";
import ListLoader from "@/app/_components/ui/loaders/ListLoader";
import { ThrobberSize } from "@/app/_components/ui/loaders/Throbber";
import { useDataContext } from "@/app/_libs/contexts/providers/ServerContextProvider";
import useSearchFriends from "@/app/_libs/hooks/api/queries/useSearchFriends";
import Link from "next/link";
import { useState } from "react";
import SearchBox from "../../../_components/ui/searchBox";

export default function FriendList({
  userId,
  followship,
  title,
}: {
  userId: string;
  followship: string;
  title: string;
}) {
  const [query, setQuery] = useState("");
  const { authProfile } = useDataContext();
  const {
    friendList,
    friendshipList,
    fetchNextPage,
    isFetching,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchFriends(userId, followship, query);

  return (
    <div className="flex flex-col max-w-[400px] max-h-[400px] w-following-list-width h-following-list-height rounded-lg">
      <div className="font-bold border-b text-lg h-[50px] shrink-0 flex items-center justify-center">
        {title}
      </div>
      <div className="grow overflow-y-auto h-auto py-1">
        {query.length == 0 && isFetching && !isFetchingNextPage ? (
          <ListLoader />
        ) : friendList.length > 0 ||
          (friendList.length == 0 && query.length > 0) ? (
          <>
            <div className="px-3 relative flex items-center justify-center shrink-0">
              <SearchBox
                className="h-[50px] bg-inherit"
                setQuery={setQuery}
                isSearching={
                  query.length > 0 && isFetching && !isFetchingNextPage
                }
              />
            </div>
            {friendList.length === 0 ? (
              <div className="flex justify-center">No results found.</div>
            ) : (
              friendList.map((friend, i) => {
                return (
                  <div
                    key={i}
                    className="flex px-4 py-2 justify-center items-center"
                  >
                    <ProfileImage
                      imageURL={friend.profileImageUrl}
                      className="size-comment-profile-image-size"
                    />
                    <div className="pl-4 grow">
                      <Link href={friend.username} className="font-bold">
                        {friend.name}
                      </Link>
                      <p className="text-text-secondary">{friend.username}</p>
                    </div>
                    {friendshipList && friend.userId !== authProfile.userId && (
                      <FollowButton
                        isFollowing={friendshipList[friend.userId].isFollowing}
                        targetProfile={friend}
                      />
                    )}
                  </div>
                );
              })
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            The list is empty
          </div>
        )}
        <InfiniteScrollLoader
          hasNextPage={hasNextPage}
          isFetching={isFetching}
          fetchNextPage={fetchNextPage}
          loaderSize={ThrobberSize.SMALL}
        />
      </div>
    </div>
  );
}
