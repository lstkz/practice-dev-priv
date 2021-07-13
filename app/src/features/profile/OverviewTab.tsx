import tw from 'twin.macro';

interface StatsProps {
  label: React.ReactNode;
  children: React.ReactNode;
  double?: boolean;
}

function Stats(props: StatsProps) {
  const { children, label, double } = props;
  return (
    <div css={[double ? tw`sm:col-span-2` : tw`sm:col-span-1`]}>
      <dt tw="text-sm font-medium text-gray-500">{label}</dt>
      <dd tw="mt-1 text-sm text-gray-900">{children}</dd>
    </div>
  );
}

export function OverviewTab() {
  return (
    <div className=" px-4 py-5 sm:px-6">
      <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
        <Stats label="Rank">#1</Stats>
        <Stats label="Crypto">1,003,420</Stats>
        <Stats label="Submissions">1,420</Stats>
        <Stats label="Solutions">50</Stats>
        <Stats label="Following">10</Stats>
        <Stats label="Followers">450</Stats>
        <Stats label="Member Since">Nov 2014</Stats>
        <Stats label="Last Seen">Jul 2021</Stats>
        <Stats label="About" double>
          Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt
          cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint.
          Sit id mollit nulla mollit nostrud in ea officia proident. Irure
          nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu.
        </Stats>
      </dl>
    </div>
  );
}
