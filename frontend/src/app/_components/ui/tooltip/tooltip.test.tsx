import withTooltip from "@/app/_libs/hocs/WithTooltip";
import { RenderResult, fireEvent, render } from "@testing-library/react";

const BUTTON_TEXT = 'Confirm';
const TIP_TEXT = "Click to confirm"

const Button = () => (
  <button>{BUTTON_TEXT}</button>
)
const ButtonWithTooltip = withTooltip(Button);

describe("Given button with tooltip", () => {
  let rendered: RenderResult;
  let button: HTMLElement;
  let tooltip: HTMLElement;

  beforeEach(() => {
    rendered = render(<ButtonWithTooltip tip={TIP_TEXT} />)
    button = rendered.getByText(BUTTON_TEXT)
  })

  describe("when mouse is over the button", () => {
    beforeEach(() => {
      fireEvent.mouseOver(button);
    })
    it("shows tooltip", async () => {
      tooltip = await rendered.findByRole("tooltip");
      expect(tooltip).toBeVisible();
      expect(tooltip).toHaveTextContent(TIP_TEXT);  
    })
  })
})