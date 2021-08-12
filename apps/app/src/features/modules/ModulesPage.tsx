import React from 'react';
import { ConnectedList } from '../../components/ConnectedList';
import { Container } from '../../components/Container';
import Dashboard from '../../components/Dashboard';
import { TwoColLayout } from '../../components/TwoColLayout';
import { ModuleListItem } from './ModuleListItem';
import { ModulesFilter } from './ModulesFilter';
import { useModulesActions, useModulesState } from './ModulesModule';

export function ModulesPage() {
  const {} = useModulesActions();
  const { modules, filter } = useModulesState();
  const filtered = React.useMemo(() => {
    let filtered = modules;
    if (filter.difficulty.length) {
      filtered = filtered.filter(item =>
        filter.difficulty.some(x => item.difficulty === x)
      );
    }
    if (filter.technology.length) {
      filtered = filtered.filter(item =>
        filter.technology.some(x => item.mainTechnology === x)
      );
    }
    if (filter.status.length) {
      filtered = filtered.filter(item =>
        filter.status.some(
          x =>
            (item.isAttempted && x === 'attempted') ||
            (!item.isAttempted && x === 'unattempted')
        )
      );
    }
    return filtered;
  }, [modules, filter]);
  return (
    <Dashboard>
      <Container>
        <TwoColLayout
          left={
            <ConnectedList>
              {filtered.map(item => (
                <ModuleListItem item={item} key={item.id} />
              ))}
              {!filtered.length && (
                <div tw="text-center py-5">No results found</div>
              )}
            </ConnectedList>
          }
          right={<ModulesFilter />}
        />
      </Container>
    </Dashboard>
  );
}
