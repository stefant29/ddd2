import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IC, NewC } from '../c.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IC for edit and NewCFormGroupInput for create.
 */
type CFormGroupInput = IC | PartialWithRequiredKeyOf<NewC>;

type CFormDefaults = Pick<NewC, 'id'>;

type CFormGroupContent = {
  id: FormControl<IC['id'] | NewC['id']>;
  name: FormControl<IC['name']>;
  a: FormControl<IC['a']>;
};

export type CFormGroup = FormGroup<CFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CFormService {
  createCFormGroup(c: CFormGroupInput = { id: null }): CFormGroup {
    const cRawValue = {
      ...this.getFormDefaults(),
      ...c,
    };
    return new FormGroup<CFormGroupContent>({
      id: new FormControl(
        { value: cRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(cRawValue.name),
      a: new FormControl(cRawValue.a),
    });
  }

  getC(form: CFormGroup): IC | NewC {
    return form.getRawValue() as IC | NewC;
  }

  resetForm(form: CFormGroup, c: CFormGroupInput): void {
    const cRawValue = { ...this.getFormDefaults(), ...c };
    form.reset(
      {
        ...cRawValue,
        id: { value: cRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): CFormDefaults {
    return {
      id: null,
    };
  }
}
