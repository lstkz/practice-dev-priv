import React from 'react';
import { getDifficulties } from 'src/common/helper';
import { Checkbox } from '../../components/Checkbox';
import { FilterPanel } from '../../components/FilterPanel';
import { FilterSection } from '../../components/FilterSection';
import { useUser } from '../AuthModule';
import {
  useModulesState,
  ModulesFilter as ModulesFilterType,
  useModulesActions,
} from './ModulesModule';

interface CheckboxListProps {
  idPrefix: string;
  filterProps: keyof ModulesFilterType;
  options: string[];
  disabledOptions?: Record<string, boolean>;
}

function CheckboxList(props: CheckboxListProps) {
  const { filterProps, idPrefix, options, disabledOptions } = props;
  const { toggleFilter } = useModulesActions();
  const { filter } = useModulesState();

  return (
    <>
      {options.map(option => {
        const value: any = option.toLowerCase();
        return (
          <Checkbox
            key={value}
            id={`${idPrefix}-${value}`}
            name={value}
            checked={filter[filterProps].includes(value)}
            disabled={disabledOptions?.[value]}
            onChange={() => {
              toggleFilter(filterProps, value);
            }}
          >
            <span tw="capitalize">{option}</span>
          </Checkbox>
        );
      })}
    </>
  );
}

export function ModulesFilter() {
  const user = useUser();
  const { modules } = useModulesState();
  const difficulties = getDifficulties(modules);
  return (
    <FilterPanel>
      {user && (
        <FilterSection title="Status">
          <CheckboxList
            filterProps="status"
            idPrefix="status"
            options={['Unattempted', 'Attempted']}
          />
        </FilterSection>
      )}
      <FilterSection title="Main Technology">
        <CheckboxList
          filterProps="technology"
          idPrefix="main-tech"
          options={['React', 'Angular', 'Vue']}
          disabledOptions={{
            angular: true,
            vue: true,
          }}
        />
      </FilterSection>
      <FilterSection title="Difficulty">
        <CheckboxList
          filterProps="difficulty"
          idPrefix="difficulty"
          options={difficulties}
        />
      </FilterSection>
    </FilterPanel>
  );
}
