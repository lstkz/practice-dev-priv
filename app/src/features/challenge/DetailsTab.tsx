import React from 'react';
import tw, { styled } from 'twin.macro';
import Badge from '../../components/Badge';
import { Button } from '../../components/Button';

const Wrapper = styled.div`
  h1 {
    ${tw`text-xl font-bold leading-7 text-gray-900 mt-2`}
  }

  p {
    ${tw`mt-2 text-gray-800`}
  }
`;

export function DetailsTab() {
  return (
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
  );
}
