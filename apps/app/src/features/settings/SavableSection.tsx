import React from 'react';
import { Button } from '../../components/Button';

interface SavableSectionProps {
  id: string;
  title: React.ReactNode;
  desc?: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
}

export function SavableSection(props: SavableSectionProps) {
  const { id, title, desc, children, isLoading } = props;
  const [isSaved, setIsSaved] = React.useState(false);
  const timeoutRef = React.useRef<any>(null);
  React.useEffect(() => {
    if (isLoading) {
      setIsSaved(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }
  }, [isLoading]);
  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);
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
          <div tw="inline-block">
            <Button
              htmlType="submit"
              type="dark"
              loading={isLoading}
              disabled={isSaved}
            >
              {isSaved ? 'Saved!' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
