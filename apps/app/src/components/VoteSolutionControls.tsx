import React from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import { Solution } from 'shared';
import { IconButton } from './IconButton';
import tw from 'twin.macro';
import { api } from 'src/services/api';
import { usePub } from 'src/features/PubSubContextModule';

interface VoteSolutionControlsProps {
  readOnly?: boolean;
  horizontal?: boolean;
  solution: Solution;
}

export function VoteSolutionControls(props: VoteSolutionControlsProps) {
  const { solution, horizontal, readOnly } = props;
  const pub = usePub();

  const voteVersionRef = React.useRef(0);
  const voteSolution = async (vote: 'up' | 'down') => {
    const diff = vote === 'up' ? 1 : -1;
    if (Math.abs(solution.myScore + diff) > 1) {
      return;
    }
    const version = ++voteVersionRef.current;
    const tmpResult = {
      score: solution.score + diff,
      myScore: solution.myScore + diff,
    };
    pub({
      type: 'solution-vote-stats-updated',
      payload: {
        solutionId: solution.id,
        result: tmpResult,
      },
    });
    const voteResult = await api.solution_voteSolution(solution.id, vote);
    if (version === voteVersionRef.current) {
      pub({
        type: 'solution-vote-stats-updated',
        payload: {
          solutionId: solution.id,
          result: voteResult,
        },
      });
    }
  };
  return (
    <div
      css={[
        horizontal ? tw`flex items-center space-x-1` : tw`flex flex-col ml-2`,
      ]}
    >
      {!readOnly && (
        <IconButton
          state={solution.myScore === 1 ? 'green' : undefined}
          onClick={() => voteSolution('up')}
        >
          <ChevronUpIcon />
        </IconButton>
      )}
      <span tw="text-base text-center font-bold text-indigo-200 py-1">
        {solution.score}
      </span>
      {!readOnly && (
        <IconButton
          state={solution.myScore === -1 ? 'red' : undefined}
          onClick={() => voteSolution('down')}
        >
          <ChevronDownIcon />
        </IconButton>
      )}
    </div>
  );
}
