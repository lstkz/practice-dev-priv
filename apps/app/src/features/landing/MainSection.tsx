import React from 'react';
import { LandingHeader } from './LandingHeader';
import { RegisterForm } from './RegisterForm';
import { ProductHunt } from './ProductHunt';
import { ReactLogo } from './ReactLogo';
import { TsLogo } from './TsLogo';
import { CryptoBanner } from './CryptoBanner';

export function MainSection() {
  return (
    <>
      <CryptoBanner />
      <div className="relative bg-gray-800 ">
        <div
          className="hidden sm:block sm:absolute sm:inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <svg
            className="absolute bottom-0 right-0 transform translate-x-1/2 mb-48 text-gray-700 lg:top-0 lg:mt-28 lg:mb-0 xl:transform-none xl:translate-x-0"
            width={364}
            height={384}
            viewBox="0 0 364 384"
            fill="none"
          >
            <defs>
              <pattern
                id="eab71dd9-9d7a-47bd-8044-256344ee00d0"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} fill="currentColor" />
              </pattern>
            </defs>
            <rect
              width={364}
              height={384}
              fill="url(#eab71dd9-9d7a-47bd-8044-256344ee00d0)"
            />
          </svg>
        </div>
        <div className="relative pt-20 pb-16 sm:pb-24">
          <LandingHeader />

          <main className="mt-16 sm:mt-24">
            <div className="mx-auto max-w-7xl">
              <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center relative">
                  <div>
                    <ProductHunt tw="lg:absolute  top-1 hidden lg:block" />
                    <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl">
                      <div>Learn programming</div>
                      <div className="text-indigo-400">for free</div>
                    </h1>
                    <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                      We are the first education platform backed by{' '}
                      <span className="px-3 py-0.5 text-white text-xs font-semibold leading-5 uppercase tracking-wide bg-yellow-500 rounded-full">
                        crypto
                      </span>
                    </p>
                    <p className="mt-8 text-sm text-white uppercase tracking-wide font-semibold sm:mt-10">
                      Supported technologies
                    </p>
                    <div className="mt-5 w-full sm:mx-auto sm:max-w-lg lg:ml-0">
                      <div className="flex flex-wrap items-start justify-between">
                        <div className="flex justify-center items-center px-1">
                          <ReactLogo className="text-white w-12 h-12" />
                          <span className="text-white text-2xl ml-2 font-semibold">
                            React
                          </span>
                        </div>
                        <div className="flex justify-center items-center px-1">
                          <TsLogo className="text-white w-12 h-12" />
                          <span className="text-white text-2xl ml-2 font-semibold">
                            Typescript
                          </span>
                        </div>
                      </div>
                    </div>
                    <div tw="lg:hidden flex justify-center mt-8">
                      <ProductHunt />
                    </div>
                  </div>
                </div>
                <RegisterForm />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
