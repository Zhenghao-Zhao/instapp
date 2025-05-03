import useEndOfCarousel from "@/app/_libs/hooks/useEndOfCarousel";
import Image from "next/image";
import { useRef, useState } from "react";
import IntersectObserver from "../../common/IntersectObserver";
import CarouselArrow from "./CarouselArrow";
import CarouselPagination from "./CarouselPagination";

export default function FloatCarousel({ dataURLs }: { dataURLs: string[] }) {
  const displayRef = useRef<HTMLDivElement>(null);
  const { leftRef, rightRef, leftDisabled, rightDisabled } = useEndOfCarousel();
  const [imageIndex, setImageIndex] = useState(0);

  const changeSlide = (n: 1 | -1) => {
    if (!displayRef.current) return;
    const node = displayRef.current;
    const size = node.offsetHeight;
    setImageIndex((prev) => prev + n);
    node.scrollLeft += size * n;
  };

  return (
    <div className="flex w-full h-full justify-center items-center bg-background-primary relative overflow-hidden">
      <div
        className="overflow-scroll scroll-smooth h-full w-full flex scrollbar-none"
        style={{ scrollSnapType: "x mandatory" }}
        ref={displayRef}
      >
        <div ref={leftRef} />
        {dataURLs.map((url: string, i) => (
          <div
            key={i}
            className="shrink-0 w-full h-full relative flex"
            style={{ scrollSnapAlign: "start" }}
          >
            <Image
              src={url}
              className="object-cover w-full h-full"
              alt="post image"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <IntersectObserver
              onIntersect={() => setImageIndex(i)}
              className="m-auto"
            />
          </div>
        ))}
        <div ref={rightRef} />
      </div>
      {dataURLs && dataURLs.length > 1 && (
        <CarouselPagination count={dataURLs.length} currIndex={imageIndex} />
      )}
      {!leftDisabled && (
        <CarouselArrow
          direction="l"
          onClick={() => changeSlide(-1)}
          className="absolute left-2"
        />
      )}
      {!rightDisabled && (
        <CarouselArrow
          direction="r"
          onClick={() => changeSlide(1)}
          className="absolute right-2"
        />
      )}
    </div>
  );
}
