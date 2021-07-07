import React from 'react';
import ReactTooltip from 'react-tooltip';
import { styled } from 'twin.macro';

interface TooltipProps {
  children: React.ReactNode;
  tooltip: React.ReactNode;
  className?: string;
}

let nextId = 1;

const Wrapper = styled.div`
  .__react_component_tooltip.show {
    opacity: 1 !important;
  }
`;

export function Tooltip(props: TooltipProps) {
  const { children, className, tooltip } = props;
  const [id, setId] = React.useState('');
  React.useEffect(() => {
    setId(`Tooltip-${nextId++}`);
  }, []);

  return (
    <Wrapper className={className} data-tip data-for={id}>
      {children}

      {id && (
        <ReactTooltip type="dark" id={id} effect="solid">
          {tooltip}
        </ReactTooltip>
      )}
    </Wrapper>
  );
}
