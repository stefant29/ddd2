import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IA } from '../a.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../a.test-samples';

import { AService } from './a.service';

const requireRestSample: IA = {
  ...sampleWithRequiredData,
};

describe('A Service', () => {
  let service: AService;
  let httpMock: HttpTestingController;
  let expectedResult: IA | IA[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AService);
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

    it('should create a A', () => {
      const a = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(a).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a A', () => {
      const a = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(a).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a A', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of A', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a A', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addAToCollectionIfMissing', () => {
      it('should add a A to an empty array', () => {
        const a: IA = sampleWithRequiredData;
        expectedResult = service.addAToCollectionIfMissing([], a);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(a);
      });

      it('should not add a A to an array that contains it', () => {
        const a: IA = sampleWithRequiredData;
        const aCollection: IA[] = [
          {
            ...a,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addAToCollectionIfMissing(aCollection, a);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a A to an array that doesn't contain it", () => {
        const a: IA = sampleWithRequiredData;
        const aCollection: IA[] = [sampleWithPartialData];
        expectedResult = service.addAToCollectionIfMissing(aCollection, a);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(a);
      });

      it('should add only unique A to an array', () => {
        const aArray: IA[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const aCollection: IA[] = [sampleWithRequiredData];
        expectedResult = service.addAToCollectionIfMissing(aCollection, ...aArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const a: IA = sampleWithRequiredData;
        const a2: IA = sampleWithPartialData;
        expectedResult = service.addAToCollectionIfMissing([], a, a2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(a);
        expect(expectedResult).toContain(a2);
      });

      it('should accept null and undefined values', () => {
        const a: IA = sampleWithRequiredData;
        expectedResult = service.addAToCollectionIfMissing([], null, a, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(a);
      });

      it('should return initial array if no A is added', () => {
        const aCollection: IA[] = [sampleWithRequiredData];
        expectedResult = service.addAToCollectionIfMissing(aCollection, undefined, null);
        expect(expectedResult).toEqual(aCollection);
      });
    });

    describe('compareA', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareA(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareA(entity1, entity2);
        const compareResult2 = service.compareA(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareA(entity1, entity2);
        const compareResult2 = service.compareA(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareA(entity1, entity2);
        const compareResult2 = service.compareA(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
