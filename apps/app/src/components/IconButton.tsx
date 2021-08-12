import tw, { styled } from 'twin.macro';
import { getBaseButtonStyles } from './Button';

export interface IconButtonProps {
  state?: 'red' | 'green';
}

export const IconButton = styled.button<IconButtonProps>`
  ${getBaseButtonStyles({
    type: 'light',
    focusBg: 'gray-900',
  })}
  ${props => props.state === 'red' && tw`bg-red-400 hover:bg-red-500`}
  ${props => props.state === 'green' && tw`bg-green-400 hover:bg-green-500`}
  ${tw`h-5 w-6 p-0 rounded-sm`}
`;
