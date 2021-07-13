interface SeparatorProps {
  children: React.ReactNode;
  className?: string;
}

export function Separator(props: SeparatorProps) {
  const { children, className } = props;
  return (
    <div tw="relative" className={className}>
      <div tw="absolute inset-0 flex items-center" aria-hidden="true">
        <div tw="w-full border-t border-gray-300" />
      </div>
      <div tw="relative flex justify-center text-sm">
        <span tw="px-2 bg-white text-gray-500">{children}</span>
      </div>
    </div>
  );
}
