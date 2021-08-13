import React from 'react';
import Badge from '../../components/Badge';
import Breadcrumb from '../../components/Breadcrumb';
import { BreadcrumbItem } from '../../components/BreadcrumbItem';
import { ConnectedList } from '../../components/ConnectedList';
import { Container } from '../../components/Container';
import Dashboard from '../../components/Dashboard';
import { TwoColLayout } from '../../components/TwoColLayout';
import { ChallengeListItem } from './ChallengeListItem';
import { ModuleFilter } from './ModuleFilter';
import { useModuleActions, useModuleState } from './ModuleModule';

export function ModulePage() {
  const {} = useModuleActions();
  const { challenges, module, filter } = useModuleState();
  const allTags = [module.mainTechnology, ...module.tags, module.difficulty];

  const filtered = React.useMemo(() => {
    let filtered = challenges;
    if (filter.difficulty.length) {
      filtered = filtered.filter(item =>
        filter.difficulty.some(x => item.difficulty === x)
      );
    }
    if (filter.status.length) {
      filtered = filtered.filter(item =>
        filter.status.some(
          x =>
            (item.isAttempted && x === 'attempted') ||
            (!item.isAttempted && x === 'unattempted') ||
            (item.isSolved && x === 'solved')
        )
      );
    }
    return filtered;
  }, [challenges, filter]);

  return (
    <Dashboard>
      <Breadcrumb>
        <BreadcrumbItem>{module.title}</BreadcrumbItem>
      </Breadcrumb>
      <Container>
        <div>
          <h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {module.title}
          </h2>
          <p tw="text-sm mt-2 text-gray-600  max-w-xl">{module.description}</p>
          <div tw="mt-2 space-x-2">
            {allTags.map((tag, i) => (
              <Badge key={i} color="purple">
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
                {filtered.map(item => (
                  <ChallengeListItem item={item} key={item.id} />
                ))}
                {!filtered.length && (
                  <div tw="text-center py-5">No results found</div>
                )}
              </ConnectedList>
            }
            right={<ModuleFilter />}
          />
        </div>
      </Container>
    </Dashboard>
  );
}
