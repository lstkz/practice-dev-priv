import React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { FilterPanel } from '../../components/FilterPanel';
import { FilterSection } from '../../components/FilterSection';

export function ModuleFilter() {
  return (
    <FilterPanel>
      <FilterSection title="Status">
        <Checkbox id="status-unattempted" name="status">
          Unattempted
        </Checkbox>
        <Checkbox id="status-attempted" name="status">
          Attempted
        </Checkbox>
        <Checkbox id="status-solved" name="solved">
          Solved
        </Checkbox>
      </FilterSection>
      <FilterSection title="Difficulty">
        <Checkbox id="difficulty-beginner" name="difficulty">
          Beginner
        </Checkbox>
        <Checkbox id="difficulty-intermediate" name="difficulty">
          Intermediate
        </Checkbox>
        <Checkbox id="difficulty-various" name="difficulty">
          Various
        </Checkbox>
      </FilterSection>
    </FilterPanel>
  );
}
