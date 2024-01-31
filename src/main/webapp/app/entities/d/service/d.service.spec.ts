import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ID } from '../d.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../d.test-samples';

import { DService } from './d.service';

const requireRestSample: ID = {
  ...sampleWithRequiredData,
};

describe('D Service', () => {
  let service: DService;
  let httpMock: HttpTestingController;
  let expectedResult: ID | ID[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('ABC').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a D', () => {
      const d = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(d).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a D', () => {
      const d = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(d).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a D', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of D', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a D', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDToCollectionIfMissing', () => {
      it('should add a D to an empty array', () => {
        const d: ID = sampleWithRequiredData;
        expectedResult = service.addDToCollectionIfMissing([], d);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(d);
      });

      it('should not add a D to an array that contains it', () => {
        const d: ID = sampleWithRequiredData;
        const dCollection: ID[] = [
          {
            ...d,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDToCollectionIfMissing(dCollection, d);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a D to an array that doesn't contain it", () => {
        const d: ID = sampleWithRequiredData;
        const dCollection: ID[] = [sampleWithPartialData];
        expectedResult = service.addDToCollectionIfMissing(dCollection, d);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(d);
      });

      it('should add only unique D to an array', () => {
        const dArray: ID[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const dCollection: ID[] = [sampleWithRequiredData];
        expectedResult = service.addDToCollectionIfMissing(dCollection, ...dArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const d: ID = sampleWithRequiredData;
        const d2: ID = sampleWithPartialData;
        expectedResult = service.addDToCollectionIfMissing([], d, d2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(d);
        expect(expectedResult).toContain(d2);
      });

      it('should accept null and undefined values', () => {
        const d: ID = sampleWithRequiredData;
        expectedResult = service.addDToCollectionIfMissing([], null, d, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(d);
      });

      it('should return initial array if no D is added', () => {
        const dCollection: ID[] = [sampleWithRequiredData];
        expectedResult = service.addDToCollectionIfMissing(dCollection, undefined, null);
        expect(expectedResult).toEqual(dCollection);
      });
    });

    describe('compareD', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareD(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareD(entity1, entity2);
        const compareResult2 = service.compareD(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareD(entity1, entity2);
        const compareResult2 = service.compareD(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareD(entity1, entity2);
        const compareResult2 = service.compareD(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
