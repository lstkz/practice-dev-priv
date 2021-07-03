import * as React from 'react';

interface ReactLogoProps {
  className?: string;
}

export function ReactLogo(props: ReactLogoProps) {
  return (
    <svg viewBox="-11.5 -10.23174 23 20.46348" {...props}>
      <title>React Logo</title>
      <circle cx="0" cy="0" r="2.05" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}
