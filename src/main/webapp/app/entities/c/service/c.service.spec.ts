import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IC } from '../c.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../c.test-samples';

import { CService } from './c.service';

const requireRestSample: IC = {
  ...sampleWithRequiredData,
};

describe('C Service', () => {
  let service: CService;
  let httpMock: HttpTestingController;
  let expectedResult: IC | IC[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CService);
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

    it('should create a C', () => {
      const c = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(c).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a C', () => {
      const c = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(c).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a C', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of C', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a C', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCToCollectionIfMissing', () => {
      it('should add a C to an empty array', () => {
        const c: IC = sampleWithRequiredData;
        expectedResult = service.addCToCollectionIfMissing([], c);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(c);
      });

      it('should not add a C to an array that contains it', () => {
        const c: IC = sampleWithRequiredData;
        const cCollection: IC[] = [
          {
            ...c,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCToCollectionIfMissing(cCollection, c);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a C to an array that doesn't contain it", () => {
        const c: IC = sampleWithRequiredData;
        const cCollection: IC[] = [sampleWithPartialData];
        expectedResult = service.addCToCollectionIfMissing(cCollection, c);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(c);
      });

      it('should add only unique C to an array', () => {
        const cArray: IC[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const cCollection: IC[] = [sampleWithRequiredData];
        expectedResult = service.addCToCollectionIfMissing(cCollection, ...cArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const c: IC = sampleWithRequiredData;
        const c2: IC = sampleWithPartialData;
        expectedResult = service.addCToCollectionIfMissing([], c, c2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(c);
        expect(expectedResult).toContain(c2);
      });

      it('should accept null and undefined values', () => {
        const c: IC = sampleWithRequiredData;
        expectedResult = service.addCToCollectionIfMissing([], null, c, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(c);
      });

      it('should return initial array if no C is added', () => {
        const cCollection: IC[] = [sampleWithRequiredData];
        expectedResult = service.addCToCollectionIfMissing(cCollection, undefined, null);
        expect(expectedResult).toEqual(cCollection);
      });
    });

    describe('compareC', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareC(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareC(entity1, entity2);
        const compareResult2 = service.compareC(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareC(entity1, entity2);
        const compareResult2 = service.compareC(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareC(entity1, entity2);
        const compareResult2 = service.compareC(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
