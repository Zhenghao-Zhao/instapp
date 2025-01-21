import ProfileImage from "@/app/(pages)/[username]/_components/ProfileImage";
import { ClickDetector } from "@/app/_components/common";
import SearchBox from "@/app/_components/ui/searchBox";
import useDebounce from "@/app/_libs/hooks/useDebounce";
import { UserSearchItem } from "@/app/_libs/types";
import { InputHTMLAttributes, useState } from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import useSearchUsers from "@/app/_libs/hooks/infiniteQueries/useSearchUsers";

type Props = {
  className?: string;
};

export default function SearchBar({ className }: Props) {
  const [query, setQuery] = useState("");
  const { list, isFetching } = useSearchUsers(query);
  const [showResult, setShowResult] = useState(true);

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
            {list.map((d: UserSearchItem, i: number) => (
              <Link key={i} href={d.username}>
                <div
                  className="w-full flex items-center p-2 hover:bg-btn-hover-primary"
                  onClick={() => setShowResult(false)}
                >
                  <ProfileImage imageURL={d.imageURL} className="size-10" />
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

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  setQuery: (q: string) => void;
}

export function SearchInput({ setQuery, ...props }: SearchInputProps) {
  const [draft, setDraft] = useState("");
  // if user clears input reset query to empty string immediately
  useDebounce(() => setQuery(draft), draft, draft.length > 0 ? 500 : 0);
  return (
    <input
      {...props}
      onChange={(e) => setDraft(e.target.value)}
      value={draft}
    />
  );
}
