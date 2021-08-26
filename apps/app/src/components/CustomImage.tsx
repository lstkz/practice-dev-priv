import React from 'react';

interface CustomImageProps
  extends StaticImageData,
    Omit<React.ImgHTMLAttributes<HTMLImageElement>, keyof StaticImageData> {
  blurDataURL?: string;
}

export function CustomImage(props: CustomImageProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { blurDataURL, ...rest } = props;
  return <img {...rest} />;
}
