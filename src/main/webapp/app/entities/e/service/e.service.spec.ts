import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IE } from '../e.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../e.test-samples';

import { EService } from './e.service';

const requireRestSample: IE = {
  ...sampleWithRequiredData,
};

describe('E Service', () => {
  let service: EService;
  let httpMock: HttpTestingController;
  let expectedResult: IE | IE[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EService);
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

    it('should create a E', () => {
      const e = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(e).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a E', () => {
      const e = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(e).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a E', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of E', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a E', () => {
      const expected = true;

      service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEToCollectionIfMissing', () => {
      it('should add a E to an empty array', () => {
        const e: IE = sampleWithRequiredData;
        expectedResult = service.addEToCollectionIfMissing([], e);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(e);
      });

      it('should not add a E to an array that contains it', () => {
        const e: IE = sampleWithRequiredData;
        const eCollection: IE[] = [
          {
            ...e,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEToCollectionIfMissing(eCollection, e);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a E to an array that doesn't contain it", () => {
        const e: IE = sampleWithRequiredData;
        const eCollection: IE[] = [sampleWithPartialData];
        expectedResult = service.addEToCollectionIfMissing(eCollection, e);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(e);
      });

      it('should add only unique E to an array', () => {
        const eArray: IE[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const eCollection: IE[] = [sampleWithRequiredData];
        expectedResult = service.addEToCollectionIfMissing(eCollection, ...eArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const e: IE = sampleWithRequiredData;
        const e2: IE = sampleWithPartialData;
        expectedResult = service.addEToCollectionIfMissing([], e, e2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(e);
        expect(expectedResult).toContain(e2);
      });

      it('should accept null and undefined values', () => {
        const e: IE = sampleWithRequiredData;
        expectedResult = service.addEToCollectionIfMissing([], null, e, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(e);
      });

      it('should return initial array if no E is added', () => {
        const eCollection: IE[] = [sampleWithRequiredData];
        expectedResult = service.addEToCollectionIfMissing(eCollection, undefined, null);
        expect(expectedResult).toEqual(eCollection);
      });
    });

    describe('compareE', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareE(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = null;

        const compareResult1 = service.compareE(entity1, entity2);
        const compareResult2 = service.compareE(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'CBA' };

        const compareResult1 = service.compareE(entity1, entity2);
        const compareResult2 = service.compareE(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 'ABC' };
        const entity2 = { id: 'ABC' };

        const compareResult1 = service.compareE(entity1, entity2);
        const compareResult2 = service.compareE(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
