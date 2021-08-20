interface TwoColLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export function TwoColLayout(props: TwoColLayoutProps) {
  const { left, right } = props;

  return (
    <div tw="mt-8 max-w-3xl grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3 sm:-mx-6">
      <div tw="lg:col-start-1 lg:col-span-2">{left}</div>
      <div tw="lg:col-start-3 lg:col-span-1">{right}</div>
    </div>
  );
}
