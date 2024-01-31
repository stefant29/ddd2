import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ID } from '../d.model';
import { DService } from '../service/d.service';

export const dResolve = (route: ActivatedRouteSnapshot): Observable<null | ID> => {
  const id = route.params['id'];
  if (id) {
    return inject(DService)
      .find(id)
      .pipe(
        mergeMap((d: HttpResponse<ID>) => {
          if (d.body) {
            return of(d.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default dResolve;
