import React from 'react';
import tw, { styled } from 'twin.macro';

const Wrapper = styled.div`
  h1 {
    ${tw`text-xl font-bold leading-7 text-gray-100 mt-2 text-center`}
  }

  p {
    ${tw`mt-2 text-gray-300`}
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
