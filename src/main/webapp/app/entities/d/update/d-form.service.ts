import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ID, NewD } from '../d.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ID for edit and NewDFormGroupInput for create.
 */
type DFormGroupInput = ID | PartialWithRequiredKeyOf<NewD>;

type DFormDefaults = Pick<NewD, 'id'>;

type DFormGroupContent = {
  id: FormControl<ID['id'] | NewD['id']>;
  name: FormControl<ID['name']>;
  a: FormControl<ID['a']>;
};

export type DFormGroup = FormGroup<DFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DFormService {
  createDFormGroup(d: DFormGroupInput = { id: null }): DFormGroup {
    const dRawValue = {
      ...this.getFormDefaults(),
      ...d,
    };
    return new FormGroup<DFormGroupContent>({
      id: new FormControl(
        { value: dRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(dRawValue.name),
      a: new FormControl(dRawValue.a),
    });
  }

  getD(form: DFormGroup): ID | NewD {
    return form.getRawValue() as ID | NewD;
  }

  resetForm(form: DFormGroup, d: DFormGroupInput): void {
    const dRawValue = { ...this.getFormDefaults(), ...d };
    form.reset(
      {
        ...dRawValue,
        id: { value: dRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): DFormDefaults {
    return {
      id: null,
    };
  }
}
