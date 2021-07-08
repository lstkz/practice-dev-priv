import React from 'react';
import tw from 'twin.macro';
import { IS_SSR } from '../../config';
import { useGetter } from '../../hooks/useGetter';
import { useLayoutEffectFix } from '../../hooks/useLayoutEffectFix';
import { Resizer } from './Resizer';

interface LayoutManagerProps {
  left: React.ReactNode;
  hasLeft: boolean;
  main: React.ReactNode;
  right: React.ReactNode;
  hasRight: boolean;
}

const LEFT_MIN = 300;
const MAIN_MIN = 300;
const RIGHT_MIN = 300;
const LEFT_DEFAULT = 300;
const RIGHT_DEFAULT = 400;

function getLocalStorageSize(type: 'left' | 'right', defaultSize: number) {
  if (IS_SSR) {
    return defaultSize;
  }
  return Number(localStorage['sidebar_' + type]) || defaultSize;
}
function saveLocalStorageSize(type: 'left' | 'right', value: number) {
  localStorage['sidebar_' + type] = value;
}

export function LayoutManager(props: LayoutManagerProps) {
  const { hasLeft, left, main, right, hasRight } = props;
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [size, setSize] = React.useState({
    width: 0,
    height: 0,
  });
  const [leftSize, setLeftSize] = React.useState(LEFT_DEFAULT);
  const [rightSize, setRightSize] = React.useState(RIGHT_DEFAULT);
  useLayoutEffectFix(() => {
    setLeftSize(getLocalStorageSize('left', LEFT_DEFAULT));
    setRightSize(getLocalStorageSize('right', RIGHT_DEFAULT));
  }, []);
  const getLeftSize = useGetter(leftSize);
  const getRightSize = useGetter(rightSize);

  useLayoutEffectFix(() => {
    document.body.style.overflow = 'hidden';
    const resizeObserver = new ResizeObserver(entries => {
      const item = entries[0];
      const width = item.contentRect.width;
      const mainSize = width - getLeftSize() - getRightSize();
      let sizeNeeded = MAIN_MIN - mainSize;
      if (sizeNeeded > 0) {
        const newLeftSize = Math.max(LEFT_MIN, getLeftSize() - sizeNeeded);
        sizeNeeded -= getLeftSize() - newLeftSize;
        const newRightSize = Math.max(RIGHT_MIN, getRightSize() - sizeNeeded);
        setLeftSize(newLeftSize);
        setRightSize(newRightSize);
      }
      setSize({
        width,
        height: item.contentRect.height,
      });
    });

    resizeObserver.observe(ref.current!);
    () => {
      document.body.style.overflow = '';
      resizeObserver.disconnect();
    };
  }, []);
  React.useEffect(() => {
    saveLocalStorageSize('left', leftSize);
  }, [leftSize]);
  React.useEffect(() => {
    saveLocalStorageSize('right', rightSize);
  }, [rightSize]);

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
          minWidth={LEFT_MIN}
          maxWidth={size.width - rightSize - MAIN_MIN}
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
          minWidth={RIGHT_MIN}
          maxWidth={size.width - leftSize - MAIN_MIN}
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
