import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../b.test-samples';

import { BFormService } from './b-form.service';

describe('B Form Service', () => {
  let service: BFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BFormService);
  });

  describe('Service methods', () => {
    describe('createBFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createBFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            a: expect.any(Object),
          }),
        );
      });

      it('passing IB should create a new form with FormGroup', () => {
        const formGroup = service.createBFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            a: expect.any(Object),
          }),
        );
      });
    });

    describe('getB', () => {
      it('should return NewB for default B initial value', () => {
        const formGroup = service.createBFormGroup(sampleWithNewData);

        const b = service.getB(formGroup) as any;

        expect(b).toMatchObject(sampleWithNewData);
      });

      it('should return NewB for empty B initial value', () => {
        const formGroup = service.createBFormGroup();

        const b = service.getB(formGroup) as any;

        expect(b).toMatchObject({});
      });

      it('should return IB', () => {
        const formGroup = service.createBFormGroup(sampleWithRequiredData);

        const b = service.getB(formGroup) as any;

        expect(b).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IB should not enable id FormControl', () => {
        const formGroup = service.createBFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewB should disable id FormControl', () => {
        const formGroup = service.createBFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
