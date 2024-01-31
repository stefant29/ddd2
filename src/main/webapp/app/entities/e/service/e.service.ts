import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IE, NewE } from '../e.model';

export type PartialUpdateE = Partial<IE> & Pick<IE, 'id'>;

export type EntityResponseType = HttpResponse<IE>;
export type EntityArrayResponseType = HttpResponse<IE[]>;

@Injectable({ providedIn: 'root' })
export class EService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/es');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(e: NewE): Observable<EntityResponseType> {
    return this.http.post<IE>(this.resourceUrl, e, { observe: 'response' });
  }

  update(e: IE): Observable<EntityResponseType> {
    return this.http.put<IE>(`${this.resourceUrl}/${this.getEIdentifier(e)}`, e, { observe: 'response' });
  }

  partialUpdate(e: PartialUpdateE): Observable<EntityResponseType> {
    return this.http.patch<IE>(`${this.resourceUrl}/${this.getEIdentifier(e)}`, e, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IE>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IE[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEIdentifier(e: Pick<IE, 'id'>): string {
    return e.id;
  }

  compareE(o1: Pick<IE, 'id'> | null, o2: Pick<IE, 'id'> | null): boolean {
    return o1 && o2 ? this.getEIdentifier(o1) === this.getEIdentifier(o2) : o1 === o2;
  }

  addEToCollectionIfMissing<Type extends Pick<IE, 'id'>>(eCollection: Type[], ...eSToCheck: (Type | null | undefined)[]): Type[] {
    const eS: Type[] = eSToCheck.filter(isPresent);
    if (eS.length > 0) {
      const eCollectionIdentifiers = eCollection.map(eItem => this.getEIdentifier(eItem)!);
      const eSToAdd = eS.filter(eItem => {
        const eIdentifier = this.getEIdentifier(eItem);
        if (eCollectionIdentifiers.includes(eIdentifier)) {
          return false;
        }
        eCollectionIdentifiers.push(eIdentifier);
        return true;
      });
      return [...eSToAdd, ...eCollection];
    }
    return eCollection;
  }
}
