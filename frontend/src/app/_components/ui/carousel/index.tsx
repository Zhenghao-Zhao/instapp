import { IconType } from "@/app/_components/ui/icons";
import useEndOfCarousel from "@/app/_libs/hooks/useEndOfCarousel";
import Image from "next/image";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { IntersectObserver } from "../../common";
import IconButton from "../buttons/iconButton";

export function Carousel({ dataURLs }: { dataURLs: string[] }) {
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

export function SpacedCarousel({ dataURLs }: { dataURLs: string[] }) {
  const { leftRef, rightRef, leftDisabled, rightDisabled } = useEndOfCarousel();
  const imageGroupRef = useRef<HTMLDivElement>(null);

  const handleClick = (leftOrRight: -1 | 1) => {
    if (!imageGroupRef || !imageGroupRef.current) return;
    const node = imageGroupRef.current;
    // snap auto applied to change
    const change = node.offsetHeight;
    imageGroupRef.current.scrollLeft += change * leftOrRight;
  };

  return (
    <div className="w-full h-full relative flex justify-center items-center px-carousel-arrow-width">
      <div
        className="overflow-scroll scroll-smooth h-full w-full flex scrollbar-none smGb:scroll-p-carousel-scroll-padding"
        ref={imageGroupRef}
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div ref={leftRef} />
        <div className="grid grid-rows-1 grid-flow-col gap-carousel-image-gap h-full w-fit m-auto">
          {dataURLs.map((url: string, i) => {
            return (
              <div
                key={i}
                className="relative h-full aspect-1"
                style={{ scrollSnapAlign: "start" }}
              >
                <Image
                  src={url}
                  className="object-cover w-full h-full"
                  alt="post image"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            );
          })}
        </div>
        <div ref={rightRef} />
      </div>
      {!leftDisabled && (
        <CarouselArrow
          onClick={() => handleClick(-1)}
          direction="l"
          className="absolute left-0 h-full rounded-md"
        />
      )}
      {!rightDisabled && (
        <CarouselArrow
          onClick={() => handleClick(1)}
          direction="r"
          className="absolute right-0 h-full rounded-md"
        />
      )}
    </div>
  );
}

export function CarouselArrow({
  direction,
  onClick,
  className,
}: {
  direction: "l" | "r";
  onClick: () => void;
  className?: string;
}) {
  return (
    <IconButton
      icon={direction === "l" ? IconType.ArrowLeft : IconType.ArrowRight}
      onClick={onClick}
      className={twMerge(
        "backdrop-blur-xl bg-opacity-20 text-text-primary p-1 hover:bg-btn-hover-transparent",
        className,
      )}
    />
  );
}

export function CarouselPagination({
  count,
  currIndex,
}: {
  count: number;
  currIndex: number;
}) {
  return (
    <div className="bg-black p-2 rounded-xl bg-opacity-20 flex items-center absolute bottom-4 gap-2 z-10">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-[6px] h-[6px] transition-colors duration-100 ease-in-out rounded-full ${
            i === currIndex ? "bg-white" : "bg-black"
          }`}
        />
      ))}
    </div>
  );
}
