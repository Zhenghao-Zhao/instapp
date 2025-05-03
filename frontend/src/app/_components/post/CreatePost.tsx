import { useCallback, useEffect, useState } from "react";

import { initTransformValues } from "@/app/_libs/vars/constants";
import {
  FilterParams,
  ImageInfo,
  initFilterValues,
  Transform,
  UploadSteps,
} from "@/app/_libs/vars/types";
import Crop from "../uploadSteps/Crop";
import Drop from "../uploadSteps/Drop";
import Edit from "../uploadSteps/Edit";
import Finalize from "../uploadSteps/Finalize";

export default function CreatePost() {
  const [currentStep, setCurrentStep] = useState(0);
  const [imageInfoList, setImageInfoList] = useState<ImageInfo[]>([]);
  const [imageBlobs, setImageBlobs] = useState<Blob[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [transforms, setTransforms] = useState<Transform[]>([]);
  const [filters, setFilters] = useState<FilterParams[]>([]);
  const [uploadImages, setUploadImages] = useState<Blob[]>([]);

  useEffect(() => {
    setTransforms(
      Array.from({ length: imageInfoList.length }).map(() => {
        return initTransformValues;
      }),
    );
    setFilters(
      Array.from({ length: imageInfoList.length }).map(() => {
        return initFilterValues;
      }),
    );
    if (imageInfoList.length > 0) setCurrentStep(UploadSteps.Crop);
  }, [imageInfoList]);

  const applyTransforms = useCallback(
    (change: Transform) => {
      const update = transforms.map((t, i) => {
        return i === currentImageIndex ? change : t;
      });
      setTransforms(update);
    },
    [currentImageIndex, transforms],
  );

  const applyFilters = useCallback(
    (change: FilterParams) => {
      const update = filters.map((f, i) => {
        return i === currentImageIndex ? change : f;
      });
      setFilters(update);
    },
    [currentImageIndex, filters],
  );

  const changeCurrentImageIndex = (i: number) => {
    setCurrentImageIndex(i);
  };

  const applyUploadImages = (imageBlobs: Blob[]) => {
    setUploadImages(imageBlobs);
  };

  const goNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const goPrev = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const addImageInfo = (imageInfo: ImageInfo[]) => {
    setImageInfoList(imageInfo);
  };

  const addImageBlobs = (blobs: Blob[]) => {
    setImageBlobs(blobs);
  };

  return (
    <div
      className={`flex ${
        (currentStep < UploadSteps.Edit && "w-upload-image-width") ||
        (currentStep === UploadSteps.Edit && "w-upload-width") ||
        (currentStep === UploadSteps.AddInfo && "w-upload-width") ||
        (currentStep === UploadSteps.Submit && "w-upload-image-width")
      } transition-all`}
    >
      {currentStep === UploadSteps.Create && (
        <Drop addImageInfo={addImageInfo} addImageBlobs={addImageBlobs} />
      )}
      {currentStep === UploadSteps.Crop && (
        <Crop
          currentImageIndex={currentImageIndex}
          imageInfoList={imageInfoList}
          transforms={transforms}
          changeTransforms={applyTransforms}
          changeCurrentImageIndex={changeCurrentImageIndex}
          goPrev={goPrev}
          goNext={goNext}
        />
      )}
      {currentStep === UploadSteps.Edit && (
        <Edit
          imageInfoList={imageInfoList}
          transforms={transforms}
          filters={filters}
          blobs={imageBlobs}
          currentImageIndex={currentImageIndex}
          changeFilters={applyFilters}
          changeCurrentImageIndex={changeCurrentImageIndex}
          changeUploadImages={applyUploadImages}
          goNext={goNext}
          goPrev={goPrev}
        />
      )}
      {(currentStep === UploadSteps.AddInfo ||
        currentStep === UploadSteps.Submit) && (
        <Finalize
          uploadImages={uploadImages}
          currentImageIndex={currentImageIndex}
          currentStep={currentStep}
          changeCurrentImageIndex={changeCurrentImageIndex}
          goPrev={goPrev}
          goNext={goNext}
        />
      )}
    </div>
  );
}
