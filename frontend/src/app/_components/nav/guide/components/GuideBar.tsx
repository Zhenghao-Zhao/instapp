import Divider from "@/app/_components/ui/divider";
import { useDataContext } from "@/app/_libs/contexts/providers/ServerContextProvider";
import { twMerge } from "tailwind-merge";
import { GuideTypes } from "..";
import { useGuidebarContext } from "@/app/_libs/contexts/providers/GuidebarContextProvider";
import GuideSection from "./GuideSection";

type Props = {
  className?: string;
};

export default function GuideBar({ className }: Props) {
  const { guideLayout } = useGuidebarContext();
  const { data: serverData } = useDataContext();
  const username = serverData.profile.username;
  const sections = getGuideData(username);

  return (
    <section
      className={twMerge(
        `hidden scrollbar-hidden flex-col items-center w-guide-normal fixed top-14 bottom-0 overflow-y-scroll text-sm bg-background-primary ${
          guideLayout === GuideTypes.Regular ? "lgGb:flex" : "lgGb:hidden"
        }`,
        className,
      )}
    >
      <GuideSection title={sections[0].title} entries={sections[0].entries} />
      <Divider />
      <GuideSection title={sections[1].title} entries={sections[1].entries} />
      <Divider />
      <GuideSection title={sections[2].title} entries={sections[2].entries} />
      <Divider />
      <div className="guide-section !border-none p-4 !pb-6">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero, molestiae
        minima! Quod quas laboriosam molestias fugiat. Voluptates nesciunt optio
        placeat.
      </div>
    </section>
  );
}

function getGuideData(username: string) {
  const guideData = [
    {
      title: "",
      entries: [
        {
          title: "Home",
          url: "/",
          icon: "home",
          id: 0,
        },
        {
          title: "Explore",
          url: "/explore",
          icon: "explore",
          id: 1,
        },
      ],
    },

    {
      title: "You",
      collapse: 5,
      icon: "arrowRight",
      entries: [
        {
          title: "Your collection",
          url: "/" + username,
          icon: "you",
          id: 2,
        },
        {
          title: "Bookmarks",
          url: "#",
          icon: "library",
          id: 3,
        },
      ],
    },
    {
      title: "Explore",
      entries: [
        {
          title: "Trending",
          url: "#",
          icon: "trending",
          id: 4,
        },
        {
          title: "Music",
          url: "#",
          icon: "music",
          id: 5,
        },
        {
          title: "Films",
          url: "#",
          icon: "films",
          id: 6,
        },
        {
          title: "Live",
          url: "#",
          icon: "live",
          id: 7,
        },
        {
          title: "Gaming",
          url: "#",
          icon: "gaming",
          id: 8,
        },
        {
          title: "News",
          url: "#",
          icon: "news",
          id: 9,
        },
        {
          title: "Sports",
          url: "#",
          icon: "sports",
          id: 10,
        },
        {
          title: "Podcasts",
          url: "#",
          icon: "podcasts",
          id: 11,
        },
      ],
    },
  ];

  return guideData;
}

function getEntryIdFromPathname(pathname: string) {}
