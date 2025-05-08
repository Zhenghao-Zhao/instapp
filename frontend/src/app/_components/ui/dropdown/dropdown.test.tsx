import Providers from "@/app/_contexts/Providers";
import Dropdown from "@/app/_contexts/providers/DropdownContextProvider";
import { RenderResult, fireEvent, render } from "@testing-library/react";
import DropdownContent from "./DropdownContent";
import DropdownTrigger from "./DropdownTrigger";

const TRIGGER_TEXT = "Open";
const CONTENT_TEXT = "Content";

const BasicDropdown = () => (
  <Providers>
    <Dropdown>
      <DropdownTrigger>
        <button>{TRIGGER_TEXT}</button>
      </DropdownTrigger>
      <DropdownContent>{CONTENT_TEXT}</DropdownContent>
    </Dropdown>
  </Providers>
);

describe("Given basic dropdown", () => {
  let rendered: RenderResult;
  let content: HTMLElement | null;
  let trigger: HTMLElement;
  beforeEach(() => {
    rendered = render(<BasicDropdown />);
    content = rendered.queryByText(CONTENT_TEXT);
    trigger = rendered.getByText(TRIGGER_TEXT);
  });

  describe("before clicking trigger", () => {
    it("should not show content", () => {
      expect(content).not.toBeInTheDocument();
    });
  });

  describe("after clicking trigger", () => {
    beforeEach(() => {
      fireEvent.click(trigger);
      content = rendered.queryByText(CONTENT_TEXT);
    });

    it("should diplay content", () => {
      expect(content).toBeVisible();
      expect(content).toHaveTextContent(CONTENT_TEXT);
    });
  });
});
