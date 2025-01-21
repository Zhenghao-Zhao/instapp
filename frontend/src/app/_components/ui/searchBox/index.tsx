import { icons, IconType } from "@/app/_components/ui/icons";
import useDebounce from "@/app/_libs/hooks/useDebounce";
import React, { useState } from "react";
import Throbber from "../loaders";
import { twMerge } from "tailwind-merge";

export default function SearchBox({
  className,
  isSearching,
  setQuery,
}: {
  className?: string;
  isSearching: boolean;
  setQuery: (q: string) => void;
}) {
  const [showOverlay, setShowOverlay] = useState(true);
  const [draft, setDraft] = useState("");
  useDebounce(() => setQuery(draft), draft, draft.length > 0 ? 500 : 0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleFocus = () => {
    setShowOverlay(false);
  };

  const handleBlur = () => {
    setShowOverlay(draft.length < 1);
  };

  return (
    <div
      className={twMerge(
        "relative w-full h-full bg-input-primary flex items-center overflow-hidden",
        className
      )}
    >
      <div className="absolute right-2 z-[100]">
        {isSearching ? (
          <Throbber />
        ) : (
          !showOverlay && (
            <button
              className="flex items-center p-1 rounded-full overflow-hidden hover:bg-btn-hover-secondary"
              onClick={() => {
                setDraft("");
                setShowOverlay(true);
              }}
            >
              <div className="size-3">{icons[IconType.Cross]}</div>
            </button>
          )
        )}
      </div>
      {showOverlay && (
        <div className="absolute left-2 flex bg-inherit text-placeholder">
          <div className="size-6">{icons[IconType.Search]}</div>
          <p className="ml-1">Search</p>
        </div>
      )}
      <input
        className={`absolute w-full h-full outline-none p-2 bg-inherit ${showOverlay && "opacity-0"}`}
        onKeyDown={handleKeyDown}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={draft}
        placeholder="Search"
      />
    </div>
  );
}
