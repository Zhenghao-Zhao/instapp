import Alert from "@/app/_contexts/providers/AlertContextProvider";
import { RenderResult, fireEvent, render } from "@testing-library/react";
import AlertContent from "./AlertContent";
import AlertTrigger from "./AlertTrigger";
import DeleteAlert from "./DeleteAlert";

const OPEN_TEXT = "Open";

const BasicAlert = () => (
  <div>
    <Alert>
      <AlertTrigger>
        <button>{OPEN_TEXT}</button>
      </AlertTrigger>
      <AlertContent>
        <DeleteAlert />
      </AlertContent>
    </Alert>
    <div id="alertPortal" />
  </div>
);

describe("Given button that triggers alert", () => {
  let rendered: RenderResult;
  let trigger: HTMLElement;
  let title: HTMLElement;
  let confirmBtn: HTMLElement;
  beforeEach(() => {
    rendered = render(<BasicAlert />);
    trigger = rendered.getByText(OPEN_TEXT);
  });
  describe("after trigger is clicked", () => {
    beforeEach(() => {
      fireEvent.click(trigger);
      title = rendered.getByText("Delete Post");
      confirmBtn = rendered.getByText("Delete");
    });
    it("shows the right content", () => {
      expect(title).toBeVisible();
      expect(confirmBtn).toBeVisible();
    });
    it("removes content when confirm is clicked", () => {
      fireEvent.click(confirmBtn);
      expect(title).not.toBeInTheDocument();
    });
  });
});
