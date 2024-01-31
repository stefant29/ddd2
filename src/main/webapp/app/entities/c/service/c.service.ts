import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IC, NewC } from '../c.model';

export type PartialUpdateC = Partial<IC> & Pick<IC, 'id'>;

export type EntityResponseType = HttpResponse<IC>;
export type EntityArrayResponseType = HttpResponse<IC[]>;

@Injectable({ providedIn: 'root' })
export class CService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cs');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(c: NewC): Observable<EntityResponseType> {
    return this.http.post<IC>(this.resourceUrl, c, { observe: 'response' });
  }

  update(c: IC): Observable<EntityResponseType> {
    return this.http.put<IC>(`${this.resourceUrl}/${this.getCIdentifier(c)}`, c, { observe: 'response' });
  }

  partialUpdate(c: PartialUpdateC): Observable<EntityResponseType> {
    return this.http.patch<IC>(`${this.resourceUrl}/${this.getCIdentifier(c)}`, c, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IC>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IC[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCIdentifier(c: Pick<IC, 'id'>): string {
    return c.id;
  }

  compareC(o1: Pick<IC, 'id'> | null, o2: Pick<IC, 'id'> | null): boolean {
    return o1 && o2 ? this.getCIdentifier(o1) === this.getCIdentifier(o2) : o1 === o2;
  }

  addCToCollectionIfMissing<Type extends Pick<IC, 'id'>>(cCollection: Type[], ...cSToCheck: (Type | null | undefined)[]): Type[] {
    const cS: Type[] = cSToCheck.filter(isPresent);
    if (cS.length > 0) {
      const cCollectionIdentifiers = cCollection.map(cItem => this.getCIdentifier(cItem)!);
      const cSToAdd = cS.filter(cItem => {
        const cIdentifier = this.getCIdentifier(cItem);
        if (cCollectionIdentifiers.includes(cIdentifier)) {
          return false;
        }
        cCollectionIdentifiers.push(cIdentifier);
        return true;
      });
      return [...cSToAdd, ...cCollection];
    }
    return cCollection;
  }
}
