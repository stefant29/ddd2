import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../e.test-samples';

import { EFormService } from './e-form.service';

describe('E Form Service', () => {
  let service: EFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EFormService);
  });

  describe('Service methods', () => {
    describe('createEFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing IE should create a new form with FormGroup', () => {
        const formGroup = service.createEFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getE', () => {
      it('should return NewE for default E initial value', () => {
        const formGroup = service.createEFormGroup(sampleWithNewData);

        const e = service.getE(formGroup) as any;

        expect(e).toMatchObject(sampleWithNewData);
      });

      it('should return NewE for empty E initial value', () => {
        const formGroup = service.createEFormGroup();

        const e = service.getE(formGroup) as any;

        expect(e).toMatchObject({});
      });

      it('should return IE', () => {
        const formGroup = service.createEFormGroup(sampleWithRequiredData);

        const e = service.getE(formGroup) as any;

        expect(e).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IE should not enable id FormControl', () => {
        const formGroup = service.createEFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewE should disable id FormControl', () => {
        const formGroup = service.createEFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
