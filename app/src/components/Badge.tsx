import tw from 'twin.macro';

interface BadgeProps {
  color: 'gray' | 'red' | 'yellow' | 'purple';
  children: React.ReactNode;
}

export default function Badge(props: BadgeProps) {
  const { color, children } = props;
  return (
    <>
      <span
        css={[
          tw`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium `,
          color === 'gray' && tw`bg-gray-100 text-gray-800`,
          color === 'red' && tw`bg-red-100 text-red-800`,
          color === 'yellow' && tw`bg-yellow-100 text-yellow-800`,
          color === 'purple' && tw`bg-purple-100 text-purple-800`,
        ]}
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
      >
        {children}
      </span>
    </>
  );
}
