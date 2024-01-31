import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { CComponent } from './list/c.component';
import { CDetailComponent } from './detail/c-detail.component';
import { CUpdateComponent } from './update/c-update.component';
import CResolve from './route/c-routing-resolve.service';

const cRoute: Routes = [
  {
    path: '',
    component: CComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CDetailComponent,
    resolve: {
      c: CResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CUpdateComponent,
    resolve: {
      c: CResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CUpdateComponent,
    resolve: {
      c: CResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default cRoute;
