import React from 'react';
import Breadcrumb from '../../components/Breadcrumb';
import { BreadcrumbItem } from '../../components/BreadcrumbItem';
import { Container } from '../../components/Container';
import Dashboard from '../../components/Dashboard';
import { useModuleActions, useModuleState } from './ModuleModule';

export function ModulePage() {
  const {} = useModuleActions();
  const {} = useModuleState();
  return (
    <Dashboard>
      <Breadcrumb>
        <BreadcrumbItem>React Practice</BreadcrumbItem>
      </Breadcrumb>
      <Container>aa</Container>
    </Dashboard>
  );
}
