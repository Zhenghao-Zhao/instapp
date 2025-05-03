import { STATIC_PATHS } from "@/app/_libs/vars/constants";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

export default function ProfileImage({
  imageURL,
  className,
}: {
  imageURL: string | null | undefined;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "size-[150px] relative rounded-full overflow-hidden shadow-[0_0_0_1px_grey]",
        className,
      )}
    >
      <Image
        src={imageURL ?? STATIC_PATHS.DEFAULT_PROFILE_IMAGE}
        fill
        alt="Profile image"
        className="w-full h-full object-cover"
      />
    </div>
  );
}
