import React from 'react';
import { useGetter } from '../../hooks/useGetter';

interface ResizerProps {
  type: 'left' | 'right';
  x: number;
  minWidth: number;
  maxWidth: number;
  updateSize: (size: number) => void;
}

export function Resizer(props: ResizerProps) {
  const { type, x, updateSize } = props;
  const [isDraggingLeft, setIsDraggingLeft] = React.useState(false);
  const initialClientXRef = React.useRef(0);
  const initialXRef = React.useRef(0);
  const nodeRef = React.useRef<HTMLDivElement>(null);

  const initDragging = (clientX: number) => {
    setIsDraggingLeft(true);
    initialClientXRef.current = clientX;
    initialXRef.current = x;
  };

  const getProps = useGetter(props);

  React.useEffect(() => {
    if (!isDraggingLeft) {
      return undefined;
    }

    const onMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!nodeRef.current) {
        return;
      }
      const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      const { maxWidth, minWidth } = getProps();
      const mul = type === 'left' ? 1 : -1;
      const diff = clientX - initialClientXRef.current;
      const newWidth = initialXRef.current + diff * mul;
      if (newWidth < minWidth || newWidth > maxWidth) {
        return;
      }
      updateSize(newWidth);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove);
    const cleanup = (e?: Event) => {
      setIsDraggingLeft(false);
      if (e) {
        e.preventDefault();
      }
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', cleanup);
      document.removeEventListener('touchend', cleanup);
    };
    document.addEventListener('mouseup', cleanup);
    document.addEventListener('touchend', cleanup);
    return cleanup;
  }, [isDraggingLeft]);

  return (
    <div
      ref={nodeRef}
      tw="absolute opacity-0 w-1 h-full hover:opacity-100 z-10 bg-indigo-500 duration-75 transition-opacity delay-300 select-none"
      onTouchStart={e => {
        initDragging(e.targetTouches[0].clientX);
      }}
      onMouseDown={e => {
        e.preventDefault();
        initDragging(e.clientX);
      }}
      onClick={e => {
        e.stopPropagation();
      }}
      style={{
        [type]: x,
        transform: `translateX(${type === 'left' ? '-50%' : '50%'})`,
        top: 0,
        cursor: 'col-resize',
        opacity: isDraggingLeft ? 1 : undefined,
      }}
    />
  );
}
