import { ApiError, Transform } from "./types";

export const initTransformValues: Transform = {
  translateX: 0,
  translateY: 0,
  scale: 1,
};

export const ACCEPTED_UPLOAD_FILE_TYPE =
  "image/webp,image/jpeg,image/png,image/heic,image/heif,video/mp4,video/quicktime";

export const MAX_NUMBER_OF_UPLOAD_FILES = 10;

export enum Media {
  GUIDE_BREAKPOINT = 1310,
}

export enum Image {
  PROFILE_IMAGE_SIZE = 320,
  UPLOAD_IMAGE_SIZE = 1080,
}

export enum Dropdown {
  TOP_MARGIN = 5,
  BOX_SHADOW_WIDTH = 8,
}

export enum STATIC_PATHS {
  DEFAULT_PROFILE_IMAGE = "/static/defaultProfileImage.jpeg",
  EMPTY_FOLDER = "/static/emptyFolder.jpeg",
}

export const HttpStatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const INIT_API_ERROR: ApiError = {
  message: "Success",
};

export const ZOD_ERROR_MESSAGE =
  "There is an error with the data, please try again later";

export const UNEXPECTED_ERROR_MESSAGE =
  "An unexpected error occurred, please try again later";
