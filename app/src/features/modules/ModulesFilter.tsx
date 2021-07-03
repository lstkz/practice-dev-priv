import React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { FilterSection } from './FilterSection';

export function ModulesFilter() {
  return (
    <section aria-labelledby="filter-title" tw="lg:col-start-3 lg:col-span-1">
      <div tw="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <h2 id="filter-title" tw="text-lg font-medium text-gray-900">
          Filter
        </h2>
        <div tw="space-y-6 mt-4">
          <FilterSection title="Status">
            <Checkbox radio id="status-all" name="status">
              All
            </Checkbox>
            <Checkbox radio id="status-unattempted" name="status">
              Unattempted
            </Checkbox>
            <Checkbox radio id="status-attempted" name="status">
              Attempted
            </Checkbox>
          </FilterSection>
          <FilterSection title="Main Technology">
            <Checkbox id="main-tech-react" name="main-tech">
              React
            </Checkbox>
            <Checkbox disabled id="main-tech-angular" name="main-tech">
              Angular
            </Checkbox>
            <Checkbox disabled id="main-tech-vue" name="main-tech">
              Vue
            </Checkbox>
          </FilterSection>
          <FilterSection title="Tags"></FilterSection>
        </div>
      </div>
    </section>
  );
}
