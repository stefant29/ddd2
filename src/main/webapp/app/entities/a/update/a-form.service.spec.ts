import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../a.test-samples';

import { AFormService } from './a-form.service';

describe('A Form Service', () => {
  let service: AFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AFormService);
  });

  describe('Service methods', () => {
    describe('createAFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createAFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing IA should create a new form with FormGroup', () => {
        const formGroup = service.createAFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getA', () => {
      it('should return NewA for default A initial value', () => {
        const formGroup = service.createAFormGroup(sampleWithNewData);

        const a = service.getA(formGroup) as any;

        expect(a).toMatchObject(sampleWithNewData);
      });

      it('should return NewA for empty A initial value', () => {
        const formGroup = service.createAFormGroup();

        const a = service.getA(formGroup) as any;

        expect(a).toMatchObject({});
      });

      it('should return IA', () => {
        const formGroup = service.createAFormGroup(sampleWithRequiredData);

        const a = service.getA(formGroup) as any;

        expect(a).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IA should not enable id FormControl', () => {
        const formGroup = service.createAFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewA should disable id FormControl', () => {
        const formGroup = service.createAFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
