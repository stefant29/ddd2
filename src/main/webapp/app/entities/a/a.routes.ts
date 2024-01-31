import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { AComponent } from './list/a.component';
import { ADetailComponent } from './detail/a-detail.component';
import { AUpdateComponent } from './update/a-update.component';
import AResolve from './route/a-routing-resolve.service';

const aRoute: Routes = [
  {
    path: '',
    component: AComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ADetailComponent,
    resolve: {
      a: AResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AUpdateComponent,
    resolve: {
      a: AResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AUpdateComponent,
    resolve: {
      a: AResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default aRoute;
