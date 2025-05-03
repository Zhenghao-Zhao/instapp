import Icon from "@/app/_components/ui/icon/Icon";
import { IconType } from "@/app/_components/ui/icon/Icons";
import { Post } from "@/app/_libs/vars/types";
import Image from "next/image";
import { forwardRef, useState } from "react";

export default function PostEntry({ post }: { post: Post }) {
  return (
    <div className="relative cursor-pointer">
      <BlurImage src={post.imageUrls[0]} alt="uploadImage" />
      {post.imageUrls.length > 1 && (
        <div className="absolute top-0 right-0 w-8 h-8 flex">
          <div className="w-6 h-6 m-auto">
            <Icon icon={IconType.Carousel} />
          </div>
        </div>
      )}
    </div>
  );
}

const BlurImage = forwardRef(function BlurImage(
  {
    src,
    alt,
  }: {
    src: string;
    alt: string;
  },
  ref: React.Ref<HTMLDivElement>,
) {
  const [loading, setLoading] = useState(true);
  return (
    <div ref={ref} className="group">
      <div className="relative">
        <div
          className={`aspect-1 overflow-hidden group-hover:rounded-none duration-700`}
        >
          <Image
            src={src}
            alt={alt}
            className={`object-cover duration-700 ease-in-out
                            ${
                              loading
                                ? "grayscale blur-2xl scale-110"
                                : "grayscale-0 blur-0 scale-100"
                            }`}
            onLoad={() => {
              setLoading(false);
            }}
            priority
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
    </div>
  );
});
