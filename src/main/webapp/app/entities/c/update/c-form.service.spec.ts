import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../c.test-samples';

import { CFormService } from './c-form.service';

describe('C Form Service', () => {
  let service: CFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CFormService);
  });

  describe('Service methods', () => {
    describe('createCFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            a: expect.any(Object),
          }),
        );
      });

      it('passing IC should create a new form with FormGroup', () => {
        const formGroup = service.createCFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            a: expect.any(Object),
          }),
        );
      });
    });

    describe('getC', () => {
      it('should return NewC for default C initial value', () => {
        const formGroup = service.createCFormGroup(sampleWithNewData);

        const c = service.getC(formGroup) as any;

        expect(c).toMatchObject(sampleWithNewData);
      });

      it('should return NewC for empty C initial value', () => {
        const formGroup = service.createCFormGroup();

        const c = service.getC(formGroup) as any;

        expect(c).toMatchObject({});
      });

      it('should return IC', () => {
        const formGroup = service.createCFormGroup(sampleWithRequiredData);

        const c = service.getC(formGroup) as any;

        expect(c).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IC should not enable id FormControl', () => {
        const formGroup = service.createCFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewC should disable id FormControl', () => {
        const formGroup = service.createCFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
