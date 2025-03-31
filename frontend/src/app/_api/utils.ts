import { isAxiosError } from "axios";
export type ApiError = {
  message: string;
  status?: number;
};

export const INIT_API_ERROR: ApiError = {
  message: "Success",
};

export const ZOD_ERROR_MESSAGE =
  "There is an error with the data, please try again later";

export const UNEXPECTED_ERROR_MESSAGE =
  "An unexpected error occurred, please try again later";

export const fromError = (e: unknown): ApiError => {
  if (isAxiosError(e)) {
    const serverErrorMessage =
      e.response?.data?.message ?? UNEXPECTED_ERROR_MESSAGE;
    const status = e.response?.status;
    return {
      message: serverErrorMessage,
      status,
    };
  }
  return {
    message: UNEXPECTED_ERROR_MESSAGE,
  };
};

// export const handleApiError = (e: unknown): ApiError => {
//   if (isAxiosError(e)) {
//     if (e.response) {
//       return {
//         error: e,
//         message: e.response.data.message,
//         code: e.response.status,
//       };
//     } else if (e.request) {
//       return {
//         error: e,
//         message: "Network error",
//       };
//     } else {
//       return {
//         error: e,
//         message: "An unexpected error occurred",
//       };
//     }
//   }
//   return {
//     error: e,
//     message: "An unexpected error occurred",
//   };
// };

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
