export type Transform = {
  scale: number;
  translateX: number;
  translateY: number;
};

export const initFilterValues = {
  brightness: 1, // 0 - 2, 1 neutral
  contrast: 1, // 0 - 2, 1 neutral
  saturation: 1, // 0 - 2, 0 unsaturated, 1 unchanged
  sepia: 0, // 0 - 1, 1 completely sepia, 0 no change
  grayscale: 0, // 0 - 1, 1 completely grayscaled, 0 no change
};

export type CropParams = {
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
  displaySize: number;
  src?: string;
  image?: HTMLImageElement;
};

export type FilterParams = {
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  grayscale: number;
};

export type ImageInfo = {
  imageURL: string;
  width: number;
  height: number;
  natWidth: number;
  natHeight: number;
  image: HTMLImageElement;
};

export enum UploadSteps {
  Create,
  Crop,
  Edit,
  AddInfo,
  Submit,
}

export enum UploadState {
  Preparing,
  Uploading,
  Uploaded,
}

export const initTransformValues: Transform = {
  translateX: 0,
  translateY: 0,
  scale: 1,
};

export type CanvasData = {
  sx: number,
  sy: number,
  sWidth: number;
  sHeight: number;
  dx: number;
  dy: number;
  dWidth: number;
  dHeight: number;
  cWidth: number;
  cHeight: number;
  filter: FilterParams;
}

export const ACCEPTED_UPLOAD_FILE_TYPE =
  "image/webp,image/jpeg,image/png,image/heic,image/heif,video/mp4,video/quicktime";

export const MAX_NUMBER_OF_UPLOAD_FILES = 10;