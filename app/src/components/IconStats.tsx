import React from 'react';
import ReactTooltip from 'react-tooltip';

interface IconStatsProps {
  icon: React.ReactNode;
  children: React.ReactNode;
  tooltip: string;
}

let nextId = 1;

export function IconStats(props: IconStatsProps) {
  const { icon, tooltip, children } = props;
  const [id, setId] = React.useState('');
  React.useEffect(() => {
    setId(`IconStats-${nextId++}`);
  }, []);
  return (
    <>
      <div tw="flex items-center text-sm text-gray-500" data-tip data-for={id}>
        <span
          tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
          aria-hidden="true"
        >
          {icon}
        </span>
        <span>{children}</span>
        {id && (
          <ReactTooltip id={id} effect="solid">
            <span>{tooltip}</span>
          </ReactTooltip>
        )}
      </div>
    </>
  );
}
