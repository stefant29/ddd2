import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { EComponent } from './list/e.component';
import { EDetailComponent } from './detail/e-detail.component';
import { EUpdateComponent } from './update/e-update.component';
import EResolve from './route/e-routing-resolve.service';

const eRoute: Routes = [
  {
    path: '',
    component: EComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EDetailComponent,
    resolve: {
      e: EResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EUpdateComponent,
    resolve: {
      e: EResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EUpdateComponent,
    resolve: {
      e: EResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default eRoute;
