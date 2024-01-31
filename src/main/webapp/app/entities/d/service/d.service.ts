import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ID, NewD } from '../d.model';

export type PartialUpdateD = Partial<ID> & Pick<ID, 'id'>;

export type EntityResponseType = HttpResponse<ID>;
export type EntityArrayResponseType = HttpResponse<ID[]>;

@Injectable({ providedIn: 'root' })
export class DService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ds');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(d: NewD): Observable<EntityResponseType> {
    return this.http.post<ID>(this.resourceUrl, d, { observe: 'response' });
  }

  update(d: ID): Observable<EntityResponseType> {
    return this.http.put<ID>(`${this.resourceUrl}/${this.getDIdentifier(d)}`, d, { observe: 'response' });
  }

  partialUpdate(d: PartialUpdateD): Observable<EntityResponseType> {
    return this.http.patch<ID>(`${this.resourceUrl}/${this.getDIdentifier(d)}`, d, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ID>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ID[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDIdentifier(d: Pick<ID, 'id'>): string {
    return d.id;
  }

  compareD(o1: Pick<ID, 'id'> | null, o2: Pick<ID, 'id'> | null): boolean {
    return o1 && o2 ? this.getDIdentifier(o1) === this.getDIdentifier(o2) : o1 === o2;
  }

  addDToCollectionIfMissing<Type extends Pick<ID, 'id'>>(dCollection: Type[], ...dSToCheck: (Type | null | undefined)[]): Type[] {
    const dS: Type[] = dSToCheck.filter(isPresent);
    if (dS.length > 0) {
      const dCollectionIdentifiers = dCollection.map(dItem => this.getDIdentifier(dItem)!);
      const dSToAdd = dS.filter(dItem => {
        const dIdentifier = this.getDIdentifier(dItem);
        if (dCollectionIdentifiers.includes(dIdentifier)) {
          return false;
        }
        dCollectionIdentifiers.push(dIdentifier);
        return true;
      });
      return [...dSToAdd, ...dCollection];
    }
    return dCollection;
  }
}
