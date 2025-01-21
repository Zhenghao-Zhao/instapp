import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { ImageInfo, Transform } from "../utils";
import Dragbar from "./DragBar";

export default function AdjustableImage({
  imageInfo,
  transform,
  changeTransforms,
}: {
  imageInfo: ImageInfo;
  transform: Transform;
  changeTransforms: (t: Transform) => void;
}) {
  const [scale, setScale] = useState(transform.scale);
  const prevRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(transform.scale);
  const translateRef = useRef({
    x: transform.translateX,
    y: transform.translateY,
  });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scaleRef.current = transform.scale;
  }, [transform]);

  const changeScale = (scale: number) => {
    scaleRef.current = scale;
    setScale(scale);
    showEffect();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    prevRef.current = { x: e.pageX, y: e.pageY };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    let dx = e.pageX - prevRef.current.x;
    let dy = e.pageY - prevRef.current.y;
    translateRef.current = {
      x: translateRef.current.x + dx,
      y: translateRef.current.y + dy,
    };
    prevRef.current = { x: e.pageX, y: e.pageY };
    showEffect();
  };

  const handleMouseUp = () => {
    recenterImage();
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const recenterImage = () => {
    const containerSize = Math.min(imageInfo.height, imageInfo.width);
    const marginRight =
      (imageInfo.width * scaleRef.current - containerSize) / 2;
    const marginBottom =
      (imageInfo.height * scaleRef.current - containerSize) / 2;
    const x = Math.min(
      Math.max(translateRef.current.x, -marginRight),
      marginRight,
    );
    const y = Math.min(
      Math.max(translateRef.current.y, -marginBottom),
      marginBottom,
    );
    translateRef.current = { x, y };
    showEffect();
    changeTransforms({
      translateX: translateRef.current.x,
      translateY: translateRef.current.y,
      scale: scaleRef.current,
    });
  };

  const showEffect = () => {
    if (!imageWrapperRef.current) return;
    imageWrapperRef.current.style.transform = `translate3d(${translateRef.current.x}px,
      ${translateRef.current.y}px, 0px) scale(${scaleRef.current})`;
  };

  return (
    <div className={`flex w-full h-full shrink-0 overflow-hidden`}>
      <div
        className={`relative flex items-center justify-center w-full h-full`}
      >
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          className=" w-full h-full flex flex-col justify-center items-center"
        >
          <div
            ref={imageWrapperRef}
            className="transition-all ease-out relative shrink-0"
            style={{
              transform: `translate3d(${translateRef.current.x}px,
              ${translateRef.current.y}px, 0px) scale(${scaleRef.current})`,
              width: imageInfo.width,
              height: imageInfo.height,
            }}
          >
            <Image
              src={imageInfo.imageURL}
              fill
              alt="Upload Image"
              className="object-cover select-none"
              ref={imageRef}
            />
          </div>
        </div>
        <div className="absolute bottom-2 left-2">
          <div className="bg-black px-4 h-fit rounded-xl bg-opacity-40 w-28">
            <Dragbar
              scale={scale}
              changeScale={changeScale}
              onKnobRelease={() => recenterImage()}
              style={{ knobColor: "white", railColor: "black" }}
              minScale={1}
              maxScale={2}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
