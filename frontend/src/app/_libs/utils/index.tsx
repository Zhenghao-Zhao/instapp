import { isAxiosError } from "axios";
import { RefObject } from "react";
import { Dropdown, UNEXPECTED_ERROR_MESSAGE } from "../vars/constants";
import { ApiError, DropdownPosition } from "../vars/types";

export function delay(t: number = 3000) {
  return new Promise((resolve) => setTimeout(resolve, t));
}

export function dataURLtoBlob(dataURI: string) {
  // ref: https://stackoverflow.com/questions/12168909/blob-from-dataurl
  var byteString = atob(dataURI.split(",")[1]);
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  var blob = new Blob([ab], { type: mimeString });
  return blob;
}

export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => resolve(image);
  });
};

export const formatDate = (rawPostDate: string) => {
  const postDate = new Date(rawPostDate);
  const today = new Date();
  const totalMinutes = Math.floor(
    (today.getTime() - postDate.getTime()) / 1000 / 60,
  );
  const totalDays = Math.floor(totalMinutes / 1440);
  const totalHours = Math.floor(totalMinutes / 60);

  if (totalDays < 1) {
    if (totalHours === 1) return "1 hour";
    if (totalMinutes <= 1) return "Just now";
    return totalHours > 0 ? `${totalHours} hours` : `${totalMinutes} minutes`;
  }

  if (totalDays === 1) {
    return "1 day";
  }

  if (totalDays <= 3) {
    return `${totalDays} days`;
  }

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  } as Intl.DateTimeFormatOptions;

  return postDate.toLocaleDateString(undefined, options);
};

const calPosition = (
  openerRef: RefObject<HTMLElement>,
  contentRef: RefObject<HTMLElement>,
): DropdownPosition => {
  if (openerRef.current === null || contentRef.current === null)
    return { left: 0, top: 0 };
  const overlay = contentRef.current;
  const { left, top } = openerRef.current.getBoundingClientRect();
  const nodePosition = {
    left: left + openerRef.current.offsetWidth / 2,
    top: top + openerRef.current.offsetHeight,
  };
  const tooltipLeft = Math.max(
    0,
    Math.min(
      nodePosition.left - overlay.offsetWidth / 2,
      document.documentElement.offsetWidth -
        overlay.offsetWidth -
        Dropdown.BOX_SHADOW_WIDTH,
    ),
  );

  return { left: tooltipLeft, top: nodePosition.top + Dropdown.TOP_MARGIN };
};

export function getOverlayPosition(
  openerRef: RefObject<HTMLElement>,
  contentRef: RefObject<HTMLElement>,
  setPosition: (p: DropdownPosition) => void,
) {
  if (!openerRef.current || !contentRef.current) return;
  const position = calPosition(openerRef, contentRef);
  setPosition(position);
}

export function withCountability(
  n: number,
  singleForm: string,
  pluralForm: string,
) {
  return `${n} ${pluralize(n, singleForm, pluralForm)}`;
}

export function pluralize(n: number, singleForm: string, pluralForm?: string) {
  if (n == 1) return singleForm;
  return pluralForm || singleForm + "s";
}

export function getAbsoluteURL(subdomain: string) {
  return process.env.NEXT_PUBLIC_ORIGIN_URL + "/" + subdomain;
}

export function throttle<F extends (...args: any[]) => any>(
  func: F,
  timeout = 10,
) {
  let timer: number | undefined;
  return (...args: any) => {
    if (!timer) {
      func(...args);
    }
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}

export function debounce<F extends (...args: any[]) => ReturnType<F>>(
  func: F,
  timeout = 1000,
) {
  let timer: number | undefined;

  return (...args: Parameters<F>) => {
    if (!timer) {
      func(...args);
    }
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func(...args);
      timer = undefined;
    }, timeout);
  };
}

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
