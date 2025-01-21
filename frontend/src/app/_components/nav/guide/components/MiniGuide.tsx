import { useDataContext } from "@/app/_libs/contexts/providers/ServerContextProvider";
import { useMemo } from "react";
import { GuideTypes } from "..";
import { useGuidebarContext } from "../../../../_libs/contexts/providers/GuidebarContextProvider";
import { MiniGuideEntry } from "./GuideEntry";

export default function MiniGuide() {
  const { guideLayout } = useGuidebarContext();
  const { data } = useDataContext();

  const miniGuideData = useMemo(
    () => getMiniGuideData(data.profile.username),
    [data.profile.username],
  );

  return (
    <section
      className={`smGb:max-lgGb:flex max-smGb:hidden ${
        guideLayout === GuideTypes.Mini ? "lgGb:flex" : "lgGb:hidden"
      } 
    flex-col items-center w-guide-small fixed top-14 bottom-0 text-[10px] px-1`}
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
