import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IB } from '../b.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../b.test-samples';

import { BService } from './b.service';

const requireRestSample: IB = {
  ...sampleWithRequiredData,
};

describe('B Service', () => {
  let service: BService;
  let httpMock: HttpTestingController;
  let expectedResult: IB | IB[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BService);
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

    it('should create a B', () => {
      const b = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(b).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a B', () => {
      const b = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(b).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a B', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of B', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a B', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addBToCollectionIfMissing', () => {
      it('should add a B to an empty array', () => {
        const b: IB = sampleWithRequiredData;
        expectedResult = service.addBToCollectionIfMissing([], b);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(b);
      });

      it('should not add a B to an array that contains it', () => {
        const b: IB = sampleWithRequiredData;
        const bCollection: IB[] = [
          {
            ...b,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addBToCollectionIfMissing(bCollection, b);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a B to an array that doesn't contain it", () => {
        const b: IB = sampleWithRequiredData;
        const bCollection: IB[] = [sampleWithPartialData];
        expectedResult = service.addBToCollectionIfMissing(bCollection, b);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(b);
      });

      it('should add only unique B to an array', () => {
        const bArray: IB[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const bCollection: IB[] = [sampleWithRequiredData];
        expectedResult = service.addBToCollectionIfMissing(bCollection, ...bArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const b: IB = sampleWithRequiredData;
        const b2: IB = sampleWithPartialData;
        expectedResult = service.addBToCollectionIfMissing([], b, b2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(b);
        expect(expectedResult).toContain(b2);
      });

      it('should accept null and undefined values', () => {
        const b: IB = sampleWithRequiredData;
        expectedResult = service.addBToCollectionIfMissing([], null, b, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(b);
      });

      it('should return initial array if no B is added', () => {
        const bCollection: IB[] = [sampleWithRequiredData];
        expectedResult = service.addBToCollectionIfMissing(bCollection, undefined, null);
        expect(expectedResult).toEqual(bCollection);
      });
    });

    describe('compareB', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareB(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareB(entity1, entity2);
        const compareResult2 = service.compareB(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareB(entity1, entity2);
        const compareResult2 = service.compareB(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareB(entity1, entity2);
        const compareResult2 = service.compareB(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
