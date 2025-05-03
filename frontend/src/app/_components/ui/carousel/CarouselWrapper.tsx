import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";
import CarouselPagination from "./CarouselPagination";
import CarouselArrow from "./CarouselArrow";

export default function CarouselWrapper({
  currentIndex,
  changeIndex,
  length,
  className,
  children,
}: PropsWithChildren<{
  currentIndex: number;
  changeIndex: (i: number) => void;
  length: number;
  className?: string;
}>) {
  const changeSlide = (n: 1 | -1) => {
    changeIndex(currentIndex + n);
  };
  return (
    <div
      className={twMerge(
        "w-full h-full flex justify-center items-center relative",
        className,
      )}
    >
      {children}
      {length > 1 && (
        <CarouselPagination count={length} currIndex={currentIndex} />
      )}
      {currentIndex > 0 && (
        <CarouselArrow
          direction="l"
          onClick={() => changeSlide(-1)}
          className="absolute left-2"
        />
      )}
      {currentIndex < length - 1 && (
        <CarouselArrow
          direction="r"
          onClick={() => changeSlide(1)}
          className="absolute right-2"
        />
      )}
    </div>
  );
}
