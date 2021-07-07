import React from 'react';
import tw from 'twin.macro';
import { useLayoutEffectFix } from '../../hooks/useLayoutEffectFix';
import { Resizer } from './Resizer';

interface LayoutManagerProps {
  left: React.ReactNode;
  hasLeft: boolean;
  main: React.ReactNode;
  right: React.ReactNode;
  hasRight: boolean;
}

export function LayoutManager(props: LayoutManagerProps) {
  const { hasLeft, left, main, right, hasRight } = props;
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [size, setSize] = React.useState({
    width: 0,
    height: 0,
  });
  const [leftSize, setLeftSize] = React.useState(300);
  const [rightSize, setRightSize] = React.useState(400);
  // const [isDraggingLeft, setIsDraggingLeft] = React.useState(false);

  useLayoutEffectFix(() => {
    document.body.style.overflow = 'hidden';
    const resizeObserver = new ResizeObserver(entries => {
      const item = entries[0];
      setSize({
        width: item.contentRect.width,
        height: item.contentRect.height,
      });
    });

    resizeObserver.observe(ref.current!);
    () => {
      document.body.style.overflow = '';
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div tw="flex flex-1 h-full overflow-hidden relative" ref={ref}>
      <div
        css={[tw`h-full flex-shrink-0`, !hasLeft && tw`overflow-hidden`]}
        style={{ width: hasLeft ? leftSize : 0, height: size.height }}
      >
        {React.useMemo(() => left, [left])}
      </div>
      {hasLeft && (
        <Resizer
          type="left"
          x={leftSize}
          minWidth={300}
          maxWidth={size.width - rightSize - 100}
          updateSize={setLeftSize}
        />
      )}
      <div
        tw="h-full flex-shrink-0"
        style={{
          width:
            size.width - (hasLeft ? leftSize : 0) - (hasRight ? rightSize : 0),
          height: size.height,
        }}
      >
        {React.useMemo(() => main, [main])}
      </div>
      {hasRight && (
        <Resizer
          type="right"
          x={rightSize}
          minWidth={200}
          maxWidth={size.width - leftSize - 100}
          updateSize={setRightSize}
        />
      )}
      <div
        css={[tw`h-full flex-shrink-0`, !hasRight && tw`overflow-hidden`]}
        style={{ width: hasRight ? rightSize : 0, height: size.height }}
      >
        {React.useMemo(() => right, [right])}
      </div>
    </div>
  );
}
