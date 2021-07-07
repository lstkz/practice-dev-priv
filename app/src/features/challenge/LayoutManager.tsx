import React from 'react';
import tw from 'twin.macro';
import { useLayoutEffectFix } from '../../hooks/useLayoutEffectFix';

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
  const leftSize = 300;
  const rightSize = 400;
  return (
    <div tw="flex flex-1 h-full overflow-hidden" ref={ref}>
      <div
        css={[tw`h-full flex-shrink-0`, !hasLeft && tw`overflow-hidden`]}
        style={{ width: hasLeft ? leftSize : 0, height: size.height }}
      >
        {left}
      </div>
      <div
        tw="h-full flex-shrink-0"
        style={{
          width:
            size.width - (hasLeft ? leftSize : 0) - (hasRight ? rightSize : 0),
          height: size.height,
        }}
      >
        {main}
      </div>
      <div
        css={[tw`h-full flex-shrink-0`, !hasRight && tw`overflow-hidden`]}
        style={{ width: hasRight ? rightSize : 0, height: size.height }}
      >
        {right}
      </div>
    </div>
  );
}
