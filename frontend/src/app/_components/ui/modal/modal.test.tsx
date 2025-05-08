import { DiscardAlert } from "@/app/_components/ui/alert/templates";
import Modal from "@/app/_contexts/providers/ModalContextProivder";
import Providers from "@/app/_libs/contexts";
import { RenderResult, fireEvent, render } from "@testing-library/react";
import { ModalTrigger, ModalWrapper } from ".";

const OPEN_TEXT = "Open";
const CONTENT_TEXT = "Content";

const BasicModal = () => (
  <Providers>
    <Modal>
      <ModalWrapper>
        <div>{CONTENT_TEXT}</div>
      </ModalWrapper>
      <ModalTrigger>
        <button>{OPEN_TEXT}</button>
      </ModalTrigger>
    </Modal>
    <div id="modalPortal" />
  </Providers>
);

describe("Given basic modal", () => {
  let trigger: HTMLElement;
  let content: HTMLElement;
  let backdrop: HTMLElement;
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<BasicModal />);
    trigger = rendered.getByText(OPEN_TEXT);
  });
  describe("after clicking the trigger", () => {
    beforeEach(() => {
      fireEvent.click(trigger);
      content = rendered.getByText(CONTENT_TEXT);
      backdrop = rendered.getByRole("backdrop");
    });
    it("shows the correct content", async () => {
      expect(content).toBeVisible();
    });
    it("remains open when click onto content", () => {
      fireEvent.click(content);
      expect(content).toBeVisible();
      expect(content).toHaveTextContent(CONTENT_TEXT);
    });
    it("closes correctly when click backdrop", () => {
      fireEvent.click(backdrop);
      expect(content).not.toBeInTheDocument();
    });
  });
});

const ModalWithAlert = () => (
  <Providers>
    <Modal alert={<DiscardAlert />} alertOnCloseInit>
      <ModalWrapper>
        <div>Content</div>
      </ModalWrapper>
      <ModalTrigger>
        <button>Open</button>
      </ModalTrigger>
    </Modal>
    <div id="modalPortal" />
    <div id="alertPortal" />
  </Providers>
);

describe("Given modal that alerts when user tries to close", () => {
  let trigger: HTMLElement;
  let backdrop: HTMLElement;
  let alertBox: HTMLElement;
  let rendered: RenderResult;

  beforeEach(() => {
    rendered = render(<ModalWithAlert />);
    trigger = rendered.getByText(OPEN_TEXT);
  });
  describe("after clicking the backdrop", () => {
    beforeEach(() => {
      fireEvent.click(trigger);
      backdrop = rendered.getByRole("backdrop");
    });
    it("shows alert when click backdrop", () => {
      fireEvent.click(backdrop);
      alertBox = rendered.getByRole("alert");
      expect(alertBox).toBeVisible();
    });
  });
});
