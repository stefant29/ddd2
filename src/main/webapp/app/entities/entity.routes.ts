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
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
