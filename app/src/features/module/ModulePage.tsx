import React from 'react';
import Badge from '../../components/Badge';
import Breadcrumb from '../../components/Breadcrumb';
import { BreadcrumbItem } from '../../components/BreadcrumbItem';
import { ConnectedList } from '../../components/ConnectedList';
import { Container } from '../../components/Container';
import Dashboard from '../../components/Dashboard';
import { TwoColLayout } from '../../components/TwoColLayout';
import { Challenge, ChallengeListItem } from './ChallengeListItem';
import { useModuleActions, useModuleState } from './ModuleModule';

const item = {
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
};

const challenges: Challenge[] = [
  {
    id: 1,
    title: 'Counter',
    description: 'Create a basic counter application.',
    tags: ['beginner'],
    status: 'solved',
  },
  {
    id: 2,
    title: 'Simple password validator',
    description:
      'Validate the password and displayed a list with passed validation rules.',
    tags: ['easy'],
    status: 'attempted',
  },
  {
    id: 3,
    title: 'Like formatter',
    description: 'Format the like status text.',
    tags: ['medium'],
    status: 'unattempted',
  },
];

export function ModulePage() {
  const {} = useModuleActions();
  const {} = useModuleState();
  return (
    <Dashboard>
      <Breadcrumb>
        <BreadcrumbItem>{item.title}</BreadcrumbItem>
      </Breadcrumb>
      <Container>
        <div>
          <h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {item.title}
          </h2>
          <p tw="text-sm mt-2 text-gray-600  max-w-xl">{item.description}</p>
          <div tw="mt-2 space-x-2">
            {item.tags.map(tag => (
              <Badge key={tag} color="purple">
                {tag}
              </Badge>
            ))}
          </div>
          <div></div>
        </div>
        <div>
          <TwoColLayout
            left={
              <ConnectedList>
                {challenges.map(item => (
                  <ChallengeListItem item={item} key={item.id} />
                ))}
              </ConnectedList>
            }
            right={<div />}
          />
        </div>
      </Container>
    </Dashboard>
  );
}
