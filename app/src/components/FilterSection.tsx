interface FilterSectionProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

export function FilterSection(props: FilterSectionProps) {
  const { children, title } = props;

  return (
    <div>
      <div tw="mb-2 text-xs text-gray-500 uppercase">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
