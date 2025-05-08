import useCreatePost from "@/app/_libs/hooks/api/mutations/useCreatePost";
import { UploadSteps } from "@/app/_libs/vars/types";
import React, { useMemo, useState } from "react";
import UploadHeader from "../post/UploadHeader";
import CarouselWrapper from "../ui/carousel/CarouselWrapper";
import Spinner from "../ui/loaders/Spinner";

export default function Finalize({
  uploadImages,
  currentImageIndex,
  currentStep,
  goPrev,
  goNext,
  changeCurrentImageIndex,
}: {
  uploadImages: Blob[];
  currentImageIndex: number;
  currentStep: UploadSteps;
  goPrev: () => void;
  goNext: () => void;
  changeCurrentImageIndex: (i: number) => void;
}) {
  const [caption, setCaption] = useState("");
  const { mutate, isPending, isSuccess } = useCreatePost();

  const blobURLs = useMemo(() => {
    return uploadImages.map((blob) => URL.createObjectURL(blob));
  }, [uploadImages]);

  const handleSubmit = async () => {
    const formData = new FormData();
    for (const blob of uploadImages) {
      formData.append("files", blob);
    }
    formData.append("content", caption);
    mutate(formData);
    goNext();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCaption(e.currentTarget.value);
  };

  if (currentStep == UploadSteps.Submit) {
    return (
      <div className="flex flex-col w-full h-full">
        <UploadHeader title={isPending ? "Sharing" : "Shared"} />
        <div className="flex justify-center items-center w-upload-image-width h-upload-image-width">
          {isPending ? (
            <Spinner />
          ) : isSuccess ? (
            "Your post has been uploaded"
          ) : (
            "Upload failed, please try again later"
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col h-full">
      <UploadHeader
        onPrev={goPrev}
        onNext={handleSubmit}
        title={"Create a new post"}
        nextLabel="Share"
      />
      <div className="flex h-upload-image-width">
        <CarouselWrapper
          currentIndex={currentImageIndex}
          changeIndex={changeCurrentImageIndex}
          length={blobURLs.length}
          className="w-upload-image-width h-upload-image-width"
        >
          <img
            src={blobURLs[currentImageIndex]}
            className="object-cover w-full h-full"
            alt="upload image"
          />
        </CarouselWrapper>
        <textarea
          className="bg-modal-primary w-upload-menu-width outline-none h-full p-2 border-t"
          onChange={handleTextChange}
          value={caption}
          placeholder="Write a caption..."
        />
      </div>
    </div>
  );
}
