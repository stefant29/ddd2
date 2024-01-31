import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of, EMPTY, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IC } from '../c.model';
import { CService } from '../service/c.service';

export const cResolve = (route: ActivatedRouteSnapshot): Observable<null | IC> => {
  const id = route.params['id'];
  if (id) {
    return inject(CService)
      .find(id)
      .pipe(
        mergeMap((c: HttpResponse<IC>) => {
          if (c.body) {
            return of(c.body);
          } else {
            inject(Router).navigate(['404']);
            return EMPTY;
          }
        }),
      );
  }
  return of(null);
};

export default cResolve;
