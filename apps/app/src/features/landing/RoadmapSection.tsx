import React from 'react';
import { CheckIcon } from '@heroicons/react/solid';
import tw from 'twin.macro';

function Line({ active }: { active?: boolean }) {
  return (
    <span
      css={[
        tw`absolute top-5 left-3 -ml-px h-full w-0.5 `,
        active ? tw`bg-green-600` : tw`bg-gray-300`,
      ]}
    />
  );
}
interface RoadmapItemProps {
  title: React.ReactNode;
  active?: boolean;
  small?: boolean;
  checked?: boolean;
  isLastSmall?: boolean;
  noLine?: boolean;
}

function RoadmapItem(props: RoadmapItemProps) {
  const { title, active, small, checked, isLastSmall, noLine } = props;
  return (
    <li tw="relative pb-6" css={[small && !isLastSmall ? tw`pb-4` : tw`pb-6`]}>
      {!noLine && <Line active={active} />}
      <div tw="relative flex items-center space-x-3">
        <div
          tw="rounded-full flex items-center justify-center text-white font-bold ring-4 ring-gray-50"
          css={[
            active ? tw`bg-green-600` : tw`bg-gray-300`,
            small ? tw`h-4 w-4  ml-1` : tw`h-6 w-6 `,
          ]}
        >
          {checked && <CheckIcon tw=" h-3 w-3  text-white" />}
        </div>
        <div tw="min-w-0 flex-1">
          <div>
            <div
              tw="text-gray-900  "
              css={[small ? tw`text-sm` : tw`text-lg font-medium`]}
            >
              {title}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export function RoadmapSection() {
  return (
    <div className="relative bg-gray-50 py-16 sm:py-24  ">
      <div className="mx-auto max-w-md px-4 text-center sm:px-6 sm:max-w-3xl lg:px-8 lg:max-w-7xl">
        <h2 className="text-center text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Roadmap
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-center text-xl text-gray-500">
          Check our planning features. Using the platform will be always free.
        </p>
        <div className="flow-root max-w-lg mx-auto px-6 mt-10 text-left">
          <ul role="list" className="-mb-8">
            <RoadmapItem active title="Q3 2021" />
            <>
              <RoadmapItem
                active
                title="Launch a new version of the platform."
                small
                checked
              />
              <RoadmapItem
                active
                title="Start token sale on uniswap."
                small
                checked
              />
              <RoadmapItem
                active
                title="Support React framework with Typescript."
                small
                checked
                isLastSmall
              />
            </>
            <RoadmapItem title="Q4 2021" />
            <>
              <RoadmapItem title="Reach $1M TVL on uniswap." small />
              <RoadmapItem title="Enable royalties." small />
              <RoadmapItem title="Gamification system." small />
              <RoadmapItem title="Reach 100 challenges." small />
              <RoadmapItem title="React tutorial from basics." small />
              <RoadmapItem
                title="Typescript tutorial from basics."
                small
                isLastSmall
              />
            </>
            <RoadmapItem title="Q1 2022" />
            <>
              <RoadmapItem title="Reach 200 challenges." small />
              <RoadmapItem title="HTML & CSS tutorial from basics." small />
              <RoadmapItem
                title="Tutorials for popular React libraries."
                small
              />
              <RoadmapItem title="Vue.js tutorial from basics." small />
              <RoadmapItem
                title="Angular tutorial from basics."
                small
                isLastSmall
              />
            </>
            <RoadmapItem title="Q2 2022" />
            <>
              <RoadmapItem title="Reach 500 challenges." small />
              <RoadmapItem
                title={<span tw="font-bold">Live collaboration mode.</span>}
                small
                isLastSmall
              />
            </>
            <RoadmapItem title="Q3 2022" />
            <>
              <RoadmapItem
                title={
                  <span tw="font-bold">Workshop hosting for educators.</span>
                }
                small
              />
              <RoadmapItem
                title="Support Node.js using Web Containers."
                small
              />
              <RoadmapItem title="Node.js tutorial from basics" small />
            </>
            <RoadmapItem title="Q4 2022" />
            <RoadmapItem title="TBD" small noLine />
          </ul>
        </div>
      </div>
    </div>
  );
}
