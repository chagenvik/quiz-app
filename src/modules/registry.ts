import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export type ModuleDefinition = {
  id: string;
  icon: string;
  nameKey: string;
  descKey: string;
  route: `/${string}`;
  component: LazyExoticComponent<ComponentType>;
};

export const modules: ModuleDefinition[] = [
  {
    id: 'atlas',
    icon: '🌍',
    nameKey: 'modules.atlas.name',
    descKey: 'modules.atlas.description',
    route: '/atlas',
    component: lazy(() => import('./atlas/AtlasPage')),
  },
];
