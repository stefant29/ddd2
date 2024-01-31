import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'a',
    data: { pageTitle: 'ddd2App.a.home.title' },
    loadChildren: () => import('./a/a.routes'),
  },
  {
    path: 'b',
    data: { pageTitle: 'ddd2App.b.home.title' },
    loadChildren: () => import('./b/b.routes'),
  },
  {
    path: 'c',
    data: { pageTitle: 'ddd2App.c.home.title' },
    loadChildren: () => import('./c/c.routes'),
  },
  {
    path: 'd',
    data: { pageTitle: 'ddd2App.d.home.title' },
    loadChildren: () => import('./d/d.routes'),
  },
  {
    path: 'e',
    data: { pageTitle: 'ddd2App.e.home.title' },
    loadChildren: () => import('./e/e.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
