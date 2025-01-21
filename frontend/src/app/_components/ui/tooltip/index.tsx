import withTooltip from '@/app/_libs/hocs/WithTooltip';
import React, { PropsWithChildren } from 'react';

function TooltipWrapper({children}: PropsWithChildren) {
  return (
    children
  )
}

export default withTooltip(TooltipWrapper);
