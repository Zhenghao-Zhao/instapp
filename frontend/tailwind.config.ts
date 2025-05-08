import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        btn: {
          hover: {
            primary: "var(--btn-hover-primary)",
            secondary: "var(--btn-hover-secondary)",
            transparent: "var(--btn-hover-transparent)",
          },
          primary: "var(--btn-primary)",
          select: "var(--btn-select-primary)",
        },
        backdrop: "var(--backdrop)",
        scrollthumb: "var(--scrollthumb)",
        "scrollthumb-light": "var(--scrollthumb-light)",
        placeholder: "var(--placeholder-color)",
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
        background: {
          primary: "var(--background-primary)",
        },
        icon: {
          primary: "var(--icon-primary)",
        },
        modal: {
          primary: "var(--modal-primary)",
        },
        border: {
          primary: "var(--border-primary)",
        },
        loader: {
          primary: "var(--loader-primary)",
        },
        tooltip: {
          primary: "var(--tooltip-primary)",
          text: "var(--tooltip-text-primary)",
        },
        input: {
          primary: "var(--input-primary)",
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
      },
      spacing: {
        "nav-height": "var(--nav-height)",
        "guide-small-width": "var(--guide-small-width)",
        "guide-normal-width": "var(--guide-normal-width)",
        "footer-height": "var(--footer-height)",
        "upload-menu-width": "var(--upload-menu-width)",
        "upload-height": "var(--upload-height)",
        "upload-window-width": "var(--upload-window-width)",
        "upload-image-width": "var(--upload-image-width)",
        "upload-header-height": "var(--upload-header-height)",
        "view-width": "var(--view-width)",
        "view-arrow-width": "var(--view-arrow-width)",
        "view-image-width": "var(--view-image-width)",
        "view-comment-width": "var(--view-comment-width)",
        "view-close-top": "var(--view-close-top)",
        "view-close-right": "var(--view-close-right)",
        "profile-image-size": "var(--profile-image-size)",
        "comment-header-height": "var(--comment-header-height)",
        "comment-footer-height": "var(--comment-footer-height)",
        "comment-input-height": "var(--comment-input-height)",
        "comment-info-height": "var(--comment-info-height)",
        "comment-width": "var(--comment-width)",
        "comment-profile-image-size": "var(--comment-profile-image-size)",
        "following-list-width": "var(--following-list-width)",
        "following-list-height": "var(--following-list-height)",
        "scroll-view-width": "var(--scroll-view-width)",
        "carousel-arrow-width": "var(--carousel-arrow-width)",
        "carousel-image-size": "var(--carousel-image-size)",
        "carousel-image-gap": "var(--carousel-image-gap)",
        "carousel-scroll-padding": "var(--carousel-scroll-padding)",
      },
      minWidth: {
        "upload-window-width": "320px",
        "upload-minWidth": "var(--upload-image-width)",
      },
      maxWidth: {
        "grid-maxWidth": "var(--grid-max-width)",
        "comment-maxWidth": "var(--comment-maxWidth)",
        "postPage-maxWdith": "var(--post-page-max-width)",
      },
      minHeight: {
        "main-minHeight": "var(--main-min-height)",
        "comment-top-minHeight": "var(--comment-top-min-height)",
      },
      maxHeight: {
        "view-maxHeight": "var(--view-max-height)",
        "comment-input-maxHeight": "var(--comment-input-max-height)",
      },
      screens: {
        smGb: "820px",
        lgGb: "1310px",
      },
    },
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
};
export default config;
