import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IA, NewA } from '../a.model';

export type PartialUpdateA = Partial<IA> & Pick<IA, 'id'>;

export type EntityResponseType = HttpResponse<IA>;
export type EntityArrayResponseType = HttpResponse<IA[]>;

@Injectable({ providedIn: 'root' })
export class AService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/as');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(a: NewA): Observable<EntityResponseType> {
    return this.http.post<IA>(this.resourceUrl, a, { observe: 'response' });
  }

  update(a: IA): Observable<EntityResponseType> {
    return this.http.put<IA>(`${this.resourceUrl}/${this.getAIdentifier(a)}`, a, { observe: 'response' });
  }

  partialUpdate(a: PartialUpdateA): Observable<EntityResponseType> {
    return this.http.patch<IA>(`${this.resourceUrl}/${this.getAIdentifier(a)}`, a, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IA>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IA[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getAIdentifier(a: Pick<IA, 'id'>): string {
    return a.id;
  }

  compareA(o1: Pick<IA, 'id'> | null, o2: Pick<IA, 'id'> | null): boolean {
    return o1 && o2 ? this.getAIdentifier(o1) === this.getAIdentifier(o2) : o1 === o2;
  }

  addAToCollectionIfMissing<Type extends Pick<IA, 'id'>>(aCollection: Type[], ...aSToCheck: (Type | null | undefined)[]): Type[] {
    const aS: Type[] = aSToCheck.filter(isPresent);
    if (aS.length > 0) {
      const aCollectionIdentifiers = aCollection.map(aItem => this.getAIdentifier(aItem)!);
      const aSToAdd = aS.filter(aItem => {
        const aIdentifier = this.getAIdentifier(aItem);
        if (aCollectionIdentifiers.includes(aIdentifier)) {
          return false;
        }
        aCollectionIdentifiers.push(aIdentifier);
        return true;
      });
      return [...aSToAdd, ...aCollection];
    }
    return aCollection;
  }
}
