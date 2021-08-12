import React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { FilterPanel } from '../../components/FilterPanel';
import { FilterSection } from '../../components/FilterSection';

export function ModuleFilter() {
  return (
    <FilterPanel>
      <FilterSection title="Status">
        <Checkbox
          id="status-unattempted"
          name="status"
          checked={false}
          onChange={() => {}}
        >
          Unattempted
        </Checkbox>
        <Checkbox
          id="status-attempted"
          name="status"
          checked={false}
          onChange={() => {}}
        >
          Attempted
        </Checkbox>
        <Checkbox
          id="status-solved"
          name="solved"
          checked={false}
          onChange={() => {}}
        >
          Solved
        </Checkbox>
      </FilterSection>
      <FilterSection title="Difficulty">
        <Checkbox
          id="difficulty-beginner"
          name="difficulty"
          checked={false}
          onChange={() => {}}
        >
          Beginner
        </Checkbox>
        <Checkbox
          id="difficulty-intermediate"
          name="difficulty"
          checked={false}
          onChange={() => {}}
        >
          Intermediate
        </Checkbox>
        <Checkbox
          id="difficulty-various"
          name="difficulty"
          checked={false}
          onChange={() => {}}
        >
          Various
        </Checkbox>
      </FilterSection>
    </FilterPanel>
  );
}
