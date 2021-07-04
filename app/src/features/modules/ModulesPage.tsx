import React from 'react';
import { Container } from '../../components/Container';
import Dashboard from '../../components/Dashboard';
import { TwoColLayout } from '../../components/TwoColLayout';
import { ModuleListItem } from './ModuleListItem';
import { ModulesFilter } from './ModulesFilter';
import { useModulesActions, useModulesState } from './ModulesModule';

const items = [
  {
    id: 1,
    title: 'React practice',
    description: (
      <>
        This a generic React module that contains various challenges using only
        React library. Recommended for users who know React basics.
      </>
    ),
    solved: 0,
    total: 25,
    tags: ['react', 'various'],
  },
  {
    id: 2,
    title: 'React basics',
    description: (
      <>
        New to React? Start here! This module is recommended for users who want
        to learn React from zero.
      </>
    ),
    solved: 13,
    total: 25,
    tags: ['react', 'beginner'],
  },
  {
    id: 3,
    title: 'React + Redux',
    description: <>Learn the latest version of Redux and Redux toolkit.</>,
    solved: 25,
    total: 25,
    tags: ['react', 'redux', 'intermediate'],
  },
];

export function ModulesPage() {
  const {} = useModulesActions();
  const {} = useModulesState();
  return (
    <Dashboard>
      <Container>
        <TwoColLayout
          left={
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {items.map(item => (
                  <ModuleListItem item={item} key={item.id} />
                ))}
              </ul>
            </div>
          }
          right={<ModulesFilter />}
        />
      </Container>
    </Dashboard>
  );
}
