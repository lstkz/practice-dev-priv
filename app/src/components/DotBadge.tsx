import tw from 'twin.macro';

interface BadgeProps {
  color: 'gray' | 'red' | 'yellow' | 'purple' | 'green';
}

export default function DotBadge(props: BadgeProps) {
  const { color } = props;
  return (
    <span
      css={[
        tw`inline-flex items-center rounded-full w-3 h-3`,
        color === 'gray' && tw`bg-gray-400`,
        color === 'red' && tw`bg-red-400`,
        color === 'yellow' && tw`bg-yellow-400`,
        color === 'purple' && tw`bg-purple-400`,
        color === 'green' && tw`bg-green-400`,
      ]}
    />
  );
}
