import FollowButton from "@/app/(pages)/[username]/_components/FollowButton";
import ProfileImage from "@/app/(pages)/[username]/_components/ProfileImage";
import useSearchFriends from "@/app/_libs/hooks/infiniteQueries/useSearchFriends";
import { Friend, Friendship } from "@/app/_libs/types";
import { useState } from "react";
import { InfiniteScrollLoader } from "../../../_components/common";
import { ListLoader, ThrobberSize } from "../../../_components/ui/loaders";
import SearchBox from "../../../_components/ui/searchBox";
import { useDataContext } from "@/app/_libs/contexts/providers/ServerContextProvider";
import Link from "next/link";

export default function FriendList({
  uid,
  friendship,
}: {
  uid: string;
  friendship: Friendship;
}) {
  const [query, setQuery] = useState("");
  const { authProfile: data } = useDataContext();
  const { list, fetchNextPage, isFetching, hasNextPage, isFetchingNextPage } =
    useSearchFriends(uid, friendship, query);
  return (
    <div className="flex flex-col max-w-[400px] max-h-[400px] w-following-list-width h-following-list-height rounded-lg">
      <div className="font-bold border-b text-lg h-[50px] shrink-0 flex items-center justify-center">
        {friendship.toUpperCase()}
      </div>
      <div className="py-1 px-3 relative flex items-center justify-center shrink-0">
        <SearchBox
          className="h-[50px] bg-inherit"
          setQuery={setQuery}
          isSearching={query.length > 0 && isFetching && !isFetchingNextPage}
        />
      </div>
      <div className="grow overflow-y-auto h-auto">
        {list.length === 0 && isFetching ? (
          <ListLoader />
        ) : (
          <>
            {list.map((friend: Friend, i: number) => {
              return (
                <div
                  key={i}
                  className="flex px-4 py-2 justify-center items-center"
                >
                  <ProfileImage
                    imageURL={friend.imageURL}
                    className="size-comment-profile-image-size"
                  />
                  <div className="pl-4 grow">
                    <Link href={friend.username} className="font-bold">
                      {friend.name}
                    </Link>
                    <p className="text-text-secondary">{friend.username}</p>
                  </div>
                  {friend.uid !== data.userUid && (
                    <FollowButton
                      has_followed={friend.hasFollowed}
                      to_uid={friend.uid}
                    />
                  )}
                </div>
              );
            })}
            <InfiniteScrollLoader
              hasNextPage={hasNextPage}
              isFetching={isFetching}
              fetchNextPage={fetchNextPage}
              loaderSize={ThrobberSize.SMALL}
            />
          </>
        )}
      </div>
    </div>
  );
}
