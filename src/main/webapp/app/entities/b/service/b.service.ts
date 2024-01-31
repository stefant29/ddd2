import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IB, NewB } from '../b.model';

export type PartialUpdateB = Partial<IB> & Pick<IB, 'id'>;

export type EntityResponseType = HttpResponse<IB>;
export type EntityArrayResponseType = HttpResponse<IB[]>;

@Injectable({ providedIn: 'root' })
export class BService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/bs');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
  ) {}

  create(b: NewB): Observable<EntityResponseType> {
    return this.http.post<IB>(this.resourceUrl, b, { observe: 'response' });
  }

  update(b: IB): Observable<EntityResponseType> {
    return this.http.put<IB>(`${this.resourceUrl}/${this.getBIdentifier(b)}`, b, { observe: 'response' });
  }

  partialUpdate(b: PartialUpdateB): Observable<EntityResponseType> {
    return this.http.patch<IB>(`${this.resourceUrl}/${this.getBIdentifier(b)}`, b, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IB>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IB[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getBIdentifier(b: Pick<IB, 'id'>): string {
    return b.id;
  }

  compareB(o1: Pick<IB, 'id'> | null, o2: Pick<IB, 'id'> | null): boolean {
    return o1 && o2 ? this.getBIdentifier(o1) === this.getBIdentifier(o2) : o1 === o2;
  }

  addBToCollectionIfMissing<Type extends Pick<IB, 'id'>>(bCollection: Type[], ...bSToCheck: (Type | null | undefined)[]): Type[] {
    const bS: Type[] = bSToCheck.filter(isPresent);
    if (bS.length > 0) {
      const bCollectionIdentifiers = bCollection.map(bItem => this.getBIdentifier(bItem)!);
      const bSToAdd = bS.filter(bItem => {
        const bIdentifier = this.getBIdentifier(bItem);
        if (bCollectionIdentifiers.includes(bIdentifier)) {
          return false;
        }
        bCollectionIdentifiers.push(bIdentifier);
        return true;
      });
      return [...bSToAdd, ...bCollection];
    }
    return bCollection;
  }
}
