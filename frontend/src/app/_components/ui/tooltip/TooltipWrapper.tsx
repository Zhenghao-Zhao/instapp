import withTooltip from "@/app/_libs/hocs/WithTooltip";
import { PropsWithChildren } from "react";

function TooltipWrapper({ children }: PropsWithChildren) {
  return children;
}

export default withTooltip(TooltipWrapper);
