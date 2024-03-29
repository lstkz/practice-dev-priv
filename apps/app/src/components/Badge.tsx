import tw from 'twin.macro';

interface BadgeProps {
  className?: string;
  dot?: boolean;
  dark?: boolean;
  color: 'gray' | 'red' | 'yellow' | 'purple' | 'green';
  children?: React.ReactNode;
}

export default function Badge(props: BadgeProps) {
  const { color, children, dot, dark, className } = props;
  return (
    <>
      <span
        className={className}
        css={[
          tw`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium `,
          dot && 'p-0 w-3 h-3 rounded-full',
          color === 'gray' && tw`bg-gray-100 text-gray-800`,
          color === 'red' && tw`bg-red-100 text-red-800`,
          color === 'yellow' && tw`bg-yellow-100 text-yellow-800`,
          color === 'purple' && tw`bg-purple-100 text-purple-800`,
          color === 'green' && tw`bg-green-100 text-green-800`,
          dark && color === 'red' && tw`bg-red-700 text-white`,
          dark && color === 'green' && tw`bg-green-700 text-white`,
          dark && color === 'gray' && tw`bg-gray-700 text-white`,
        ]}
      >
        {children}
      </span>
    </>
  );
}
