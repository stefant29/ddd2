import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../d.test-samples';

import { DFormService } from './d-form.service';

describe('D Form Service', () => {
  let service: DFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DFormService);
  });

  describe('Service methods', () => {
    describe('createDFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            a: expect.any(Object),
          }),
        );
      });

      it('passing ID should create a new form with FormGroup', () => {
        const formGroup = service.createDFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
            a: expect.any(Object),
          }),
        );
      });
    });

    describe('getD', () => {
      it('should return NewD for default D initial value', () => {
        const formGroup = service.createDFormGroup(sampleWithNewData);

        const d = service.getD(formGroup) as any;

        expect(d).toMatchObject(sampleWithNewData);
      });

      it('should return NewD for empty D initial value', () => {
        const formGroup = service.createDFormGroup();

        const d = service.getD(formGroup) as any;

        expect(d).toMatchObject({});
      });

      it('should return ID', () => {
        const formGroup = service.createDFormGroup(sampleWithRequiredData);

        const d = service.getD(formGroup) as any;

        expect(d).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ID should not enable id FormControl', () => {
        const formGroup = service.createDFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewD should disable id FormControl', () => {
        const formGroup = service.createDFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
