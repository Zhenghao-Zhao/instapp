import { useDataContext } from "@/app/_contexts/providers/DataContextProvider";
import { GuideTypes } from "@/app/_libs/vars/types";
import { useMemo } from "react";
import { useGuidebarContext } from "../../_contexts/providers/GuidebarContextProvider";
import { MiniGuideEntry } from "./MiniGuideEntry";

export default function MiniGuide() {
  const { guideLayout } = useGuidebarContext();
  const { authProfile } = useDataContext();

  const miniGuideData = useMemo(
    () => getMiniGuideData(authProfile.username),
    [authProfile.username],
  );

  return (
    <section
      className={`smGb:max-lgGb:flex max-smGb:hidden ${
        guideLayout === GuideTypes.Mini ? "lgGb:flex" : "lgGb:hidden"
      } 
    flex-col items-center w-guide-small-width fixed top-14 bottom-0 text-[10px] px-1`}
    >
      {miniGuideData.map((data, i: number) => (
        <MiniGuideEntry
          key={i}
          icon={data.icon}
          title={data.title}
          url={data.url}
        />
      ))}
    </section>
  );
}

function getMiniGuideData(username: string) {
  const miniGuideData = [
    { title: "Home", icon: "home", url: "/", id: 0 },
    { title: "Shorts", icon: "shorts", url: "/shorts", id: 1 },
    {
      title: "Subscription",
      icon: "subscription",
      url: "/subscription",
      id: 2,
    },
    { title: "You", icon: "you", url: `/${username}`, id: 3 },
  ];

  return miniGuideData;
}
