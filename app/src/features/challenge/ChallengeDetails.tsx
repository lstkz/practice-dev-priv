import React from 'react';
import tw, { styled } from 'twin.macro';
import Badge from '../../components/Badge';
import { Button } from '../../components/Button';

interface ChallengeDetailsProps {}

const Wrapper = styled.div`
  h1 {
    ${tw`text-xl font-bold leading-7 text-gray-900 mt-3 border-t border-gray-200 pt-2`}
  }

  p {
    ${tw`mt-2 text-gray-800`}
  }
`;

export function ChallengeDetails() {
  return (
    <div tw="bg-gray-50 p-3 h-full">
      <div tw="flex">
        <div>
          <Badge color="purple">Easy</Badge>
        </div>
        <Button type="white" size="small" tw="ml-auto">
          Solutions
        </Button>
      </div>
      <Wrapper>
        <h1>React counter</h1>
        <p>
          Create a simple counter component. When clicking on the button the
          counter should increase by one.
        </p>
        <p>
          You are free to add classes, styles, ids, but don't edit or remove{' '}
          <code>data-test</code> attributes.
        </p>
      </Wrapper>
    </div>
  );
}
