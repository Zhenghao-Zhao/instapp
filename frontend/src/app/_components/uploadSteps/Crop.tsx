import { ImageInfo, Transform } from "@/app/_libs/vars/types";
import AdjustableImage from "../post/AdjustableImage";
import UploadHeader from "../post/UploadHeader";
import CarouselWrapper from "../ui/carousel/CarouselWrapper";

const TITLE = "Crop";

export default function Crop({
  currentImageIndex,
  imageInfoList,
  transforms,
  changeTransforms,
  changeCurrentImageIndex,
  goPrev,
  goNext,
}: {
  currentImageIndex: number;
  imageInfoList: ImageInfo[];
  transforms: Transform[];
  changeTransforms: (transform: Transform) => void;
  changeCurrentImageIndex: (imageIndex: number) => void;
  goPrev: () => void;
  goNext: () => void;
}) {
  return (
    <div className="flex w-full flex-col">
      <UploadHeader onPrev={goPrev} onNext={goNext} title={TITLE} />
      <CarouselWrapper
        currentIndex={currentImageIndex}
        changeIndex={changeCurrentImageIndex}
        length={imageInfoList.length}
        className="w-upload-image-width h-upload-image-width"
      >
        <AdjustableImage
          key={currentImageIndex}
          imageInfo={imageInfoList[currentImageIndex]}
          transform={transforms[currentImageIndex]}
          changeTransforms={changeTransforms}
        />
      </CarouselWrapper>
    </div>
  );
}
