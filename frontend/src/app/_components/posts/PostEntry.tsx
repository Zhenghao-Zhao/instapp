import Icon from "@/app/_components/ui/icon";
import { IconType } from "@/app/_components/ui/icons";
import { Post } from "@/app/_libs/types";
import { BlurImage } from "./components/BlurImage";

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
