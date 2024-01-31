import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IB } from '../b.model';
import { BService } from '../service/b.service';

export const bResolve = (route: ActivatedRouteSnapshot): Observable<null | IB> => {
  const id = route.params['id'];
  if (id) {
    return inject(BService)
      .find(id)
      .pipe(
        mergeMap((b: HttpResponse<IB>) => {
          if (b.body) {
            return of(b.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default bResolve;
