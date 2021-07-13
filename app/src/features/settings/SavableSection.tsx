import React from 'react';
import { Button } from '../../components/Button';

interface SavableSectionProps {
  id: string;
  title: React.ReactNode;
  desc?: React.ReactNode;
  children: React.ReactNode;
}

export function SavableSection(props: SavableSectionProps) {
  const { id, title, desc, children } = props;
  return (
    <section aria-labelledby={id}>
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="bg-white py-6 px-4 sm:p-6">
          <div>
            <h2 id={id} className="text-lg leading-6 font-medium text-gray-900">
              {title}
            </h2>
            {desc && <p className="mt-1 text-sm text-gray-500">{desc}</p>}
          </div>
          {children}
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <Button type="dark">Save</Button>
        </div>
      </div>
    </section>
  );
}
