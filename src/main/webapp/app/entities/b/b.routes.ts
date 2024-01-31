import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import { BComponent } from './list/b.component';
import { BDetailComponent } from './detail/b-detail.component';
import { BUpdateComponent } from './update/b-update.component';
import BResolve from './route/b-routing-resolve.service';

const bRoute: Routes = [
  {
    path: '',
    component: BComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BDetailComponent,
    resolve: {
      b: BResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BUpdateComponent,
    resolve: {
      b: BResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BUpdateComponent,
    resolve: {
      b: BResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default bRoute;
