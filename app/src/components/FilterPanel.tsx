import React from 'react';

interface FilterPanelProps {
  children: React.ReactNode;
}

export function FilterPanel(props: FilterPanelProps) {
  const { children } = props;
  return (
    <section aria-labelledby="filter-title" tw="lg:col-start-3 lg:col-span-1">
      <div tw="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <h2 id="filter-title" tw="text-lg font-medium text-gray-900">
          Filter
        </h2>
        <div tw="space-y-6 mt-4">{children}</div>
      </div>
    </section>
  );
}
