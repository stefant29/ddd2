import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IE } from '../e.model';
import { EService } from '../service/e.service';

export const eResolve = (route: ActivatedRouteSnapshot): Observable<null | IE> => {
  const id = route.params['id'];
  if (id) {
    return inject(EService)
      .find(id)
      .pipe(
        mergeMap((e: HttpResponse<IE>) => {
          if (e.body) {
            return of(e.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default eResolve;
