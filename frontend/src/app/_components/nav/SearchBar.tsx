import ProfileImage from "@/app/(pages)/[username]/_components/ProfileImage";
import useSearchUsers from "@/app/_libs/hooks/api/queries/useSearchUsers";
import useDebounce from "@/app/_libs/hooks/useDebounce";
import { User } from "@/app/_libs/vars/types";
import Link from "next/link";
import { InputHTMLAttributes, useState } from "react";
import { twMerge } from "tailwind-merge";
import ClickDetector from "../common/ClickDetector";
import SearchBox from "../ui/SearchBox";

type Props = {
  className?: string;
};

export default function UniversalSearch({ className }: Props) {
  const [query, setQuery] = useState("");
  const [showResult, setShowResult] = useState(false);
  const { list, isFetching } = useSearchUsers(query, showResult);

  return (
    <ClickDetector
      onClickInside={() => setShowResult(true)}
      onClickOutside={() => setShowResult(false)}
      className="flex basis-[600px] h-10"
    >
      <div
        className={twMerge(
          "w-full h-full flex relative items-center rounded-lg",
          className,
        )}
      >
        <SearchBox isSearching={isFetching} setQuery={setQuery} />
        {list.length > 0 && showResult && (
          <div className="p-2 absolute top-full w-full border border-solid bg-background-primary">
            {list.map((d: User, i: number) => (
              <Link key={i} href={d.username}>
                <div
                  className="w-full flex items-center p-2 hover:bg-btn-hover-primary"
                  onClick={() => setShowResult(false)}
                >
                  <ProfileImage
                    imageURL={d.profileImageUrl}
                    className="size-10"
                  />
                  <div className="ml-4">{d.username}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </ClickDetector>
  );
}
