import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { DComponent } from './list/d.component';
import { DDetailComponent } from './detail/d-detail.component';
import { DUpdateComponent } from './update/d-update.component';
import DResolve from './route/d-routing-resolve.service';

const dRoute: Routes = [
  {
    path: '',
    component: DComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DDetailComponent,
    resolve: {
      d: DResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DUpdateComponent,
    resolve: {
      d: DResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DUpdateComponent,
    resolve: {
      d: DResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default dRoute;
