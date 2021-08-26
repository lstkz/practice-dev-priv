import React from 'react';
import { getDifficulties } from 'src/common/helper';
import { Checkbox } from '../../components/Checkbox';
import { FilterPanel } from '../../components/FilterPanel';
import { FilterSection } from '../../components/FilterSection';
import {
  ModulesFilter as ModuleFilterType,
  useModuleActions,
  useModuleState,
} from './ModuleModule';

interface CheckboxListProps {
  idPrefix: string;
  filterProps: keyof ModuleFilterType;
  options: string[];
}

function CheckboxList(props: CheckboxListProps) {
  const { filterProps, idPrefix, options } = props;
  const { toggleFilter } = useModuleActions();
  const { filter } = useModuleState();

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

export function ModuleFilter() {
  const { challenges } = useModuleState();
  const difficulties = getDifficulties(challenges);
  return (
    <FilterPanel>
      <FilterSection title="Status">
        <CheckboxList
          filterProps="status"
          idPrefix="status"
          options={['Unattempted', 'Attempted', 'Solved']}
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
