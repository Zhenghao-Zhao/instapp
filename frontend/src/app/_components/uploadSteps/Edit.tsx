import useWorker from "@/app/_libs/hooks/worker/useWorker";
import { FilterParams, ImageInfo, Transform } from "@/app/_libs/vars/types";
import { useCallback, useMemo, useState } from "react";
import CanvasImage from "../post/CanvasImage";
import { EditPalette } from "../post/EditPalette";
import UploadHeader from "../post/UploadHeader";
import CarouselWrapper from "../ui/carousel/CarouselWrapper";

const UPLOAD_IMAGE_SIZE = 1080;

export default function Edit({
  imageInfoList,
  transforms,
  filters,
  blobs,
  changeFilters,
  currentImageIndex,
  changeCurrentImageIndex,
  changeUploadImages,
  goNext,
  goPrev,
}: {
  imageInfoList: ImageInfo[];
  transforms: Transform[];
  filters: FilterParams[];
  blobs: Blob[];
  currentImageIndex: number;
  changeFilters: (f: FilterParams) => void;
  changeCurrentImageIndex: (imageIndex: number) => void;
  changeUploadImages: (imageURLs: Blob[]) => void;
  goNext: () => void;
  goPrev: () => void;
}) {
  const [isPending, setPending] = useState(false);
  const worker = useWorker((e: MessageEvent<any>) => {
    changeUploadImages(e.data);
    setPending(false);
    goNext();
  });

  const onClickNext = () => {
    if (!worker) return;
    setPending(true);
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const offscreen = canvas.transferControlToOffscreen();
    const canvasData = imageInfoList.map((_, i) => {
      return { ...getCropParams(i), filter: filters[i] };
    });
    worker.postMessage({ canvas: offscreen, blobs, canvasData }, [offscreen]);
  };

  const getCropParams = useCallback(
    (imageIndex: number) => {
      const transform = transforms[imageIndex];
      const imageInfo = imageInfoList[imageIndex];
      const containerSize = Math.min(imageInfo.width, imageInfo.height);
      const marginRight =
        (imageInfo.width * transform.scale - containerSize) / 2;
      const marginBottom =
        (imageInfo.height * transform.scale - containerSize) / 2;

      const sx =
        ((marginRight - transform.translateX) /
          (imageInfo.width * transform.scale)) *
        imageInfo.natWidth;
      const sy =
        ((marginBottom - transform.translateY) /
          (imageInfo.height * transform.scale)) *
        imageInfo.natHeight;
      const sWidth =
        (containerSize / (imageInfo.width * transform.scale)) *
        imageInfo.natWidth;
      const sHeight =
        (containerSize / (imageInfo.height * transform.scale)) *
        imageInfo.natHeight;
      return {
        sx,
        sy,
        sWidth,
        sHeight,
        dx: 0,
        dy: 0,
        dWidth: UPLOAD_IMAGE_SIZE,
        dHeight: UPLOAD_IMAGE_SIZE,
        cWidth: UPLOAD_IMAGE_SIZE,
        cHeight: UPLOAD_IMAGE_SIZE,
        displaySize: containerSize,
      };
    },
    [imageInfoList, transforms],
  );

  const currentCropParams = useMemo(() => {
    return getCropParams(currentImageIndex);
  }, [currentImageIndex, getCropParams]);

  return (
    <div className="flex w-full flex-col">
      <UploadHeader
        onPrev={goPrev}
        onNext={onClickNext}
        title={"Edit"}
        isPending={isPending}
      />
      <div className="flex">
        <CarouselWrapper
          currentIndex={currentImageIndex}
          changeIndex={changeCurrentImageIndex}
          length={imageInfoList.length}
          className="w-upload-image-width h-upload-image-width"
        >
          <CanvasImage
            cropParams={{
              ...currentCropParams,
              image: imageInfoList[currentImageIndex].image,
            }}
            filterParams={filters[currentImageIndex]}
          />
        </CarouselWrapper>
        <EditPalette
          key={currentImageIndex}
          filter={filters[currentImageIndex]}
          changeFilters={changeFilters}
        />
      </div>
    </div>
  );
}
