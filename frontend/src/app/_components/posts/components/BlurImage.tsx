import Image from "next/image";
import React, { useState } from "react";

export const BlurImage = React.forwardRef(function BlurImage(
  {
    src,
    alt,
  }: {
    src: string;
    alt: string;
  },
  ref: React.Ref<HTMLDivElement>
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
