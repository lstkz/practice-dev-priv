import {
  faBook,
  faDollarSign,
  faUserGraduate,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { ArrowSvg } from './ArrowSvg';

const items = [
  {
    title: <>High-quality educational content</>,
    description: (
      <>The platform contains many tutorials and practical challenges.</>
    ),
    icon: faBook,
  },
  {
    title: <>Users join platform to learn for FREE</>,
    description: (
      <>
        Nothing can beat free. People will join platform to learn programming
        without spending money.
      </>
    ),
    icon: faUsers,
  },
  {
    title: <>0.01% of users buy $DEVC and the price raises</>,
    description: (
      <>
        A tiny percent of users will be interested in investing in crypto,
        increasing the market price.
      </>
    ),
    icon: faDollarSign,
  },
  {
    title: <>Educators create content to earn royalties</>,
    description: (
      <>
        Royalties are proportional to the crypto price. People who join the
        platform first will have a chance to earn a lot of money on royalties.
      </>
    ),
    icon: faUserGraduate,
  },
];

export function CryptoSubSection() {
  return (
    <div>
      <div className="lg:max-w-2xl lg:mx-auto lg:text-center mt-20">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          More users = Higher $DEVC = More free content
        </h2>
        <p className="mt-4 text-gray-400">
          We create a self-driven economy that will produce high-quality
          educational materials.
        </p>
      </div>

      <div className="text-white text-xl  mt-20 text-center  relative overflow-hidden">
        <div
          tw="absolute bottom-0  md:-right-72 lg:-right-48 hidden md:block"
          style={{
            transform: 'scale(-1,1)',
          }}
        >
          <ArrowSvg
            className="text-white h-24 w-auto transform  rotate-90 scale-x- invert"
            style={{ height: '50rem' }}
          />
        </div>
        {items.map((item, i) => (
          <div key={i} className="relative z-10">
            <div tw="w-12 h-12 text-lg bg-white text-gray-900 rounded-full inline-flex items-center justify-center mb-2">
              {item.icon && <FontAwesomeIcon icon={item.icon} />}
            </div>
            <div className="font-semibold">{item.title}</div>
            <div className="mt-1 text-gray-400 text-base max-w-lg lg:max-w-xl mx-auto relative z-10">
              {item.description}
            </div>
            {items.length - 1 !== i && (
              <div
                className="flex justify-center my-5 pl-10 "
                style={{
                  transform: i % 2 ? 'scale(-1,1)' : '',
                }}
              >
                <ArrowSvg className="text-white h-24 w-auto transform -rotate-90 scale-x- invert" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
