import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IB, NewB } from '../b.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IB for edit and NewBFormGroupInput for create.
 */
type BFormGroupInput = IB | PartialWithRequiredKeyOf<NewB>;

type BFormDefaults = Pick<NewB, 'id'>;

type BFormGroupContent = {
  id: FormControl<IB['id'] | NewB['id']>;
  name: FormControl<IB['name']>;
  a: FormControl<IB['a']>;
};

export type BFormGroup = FormGroup<BFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class BFormService {
  createBFormGroup(b: BFormGroupInput = { id: null }): BFormGroup {
    const bRawValue = {
      ...this.getFormDefaults(),
      ...b,
    };
    return new FormGroup<BFormGroupContent>({
      id: new FormControl(
        { value: bRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(bRawValue.name),
      a: new FormControl(bRawValue.a),
    });
  }

  getB(form: BFormGroup): IB | NewB {
    return form.getRawValue() as IB | NewB;
  }

  resetForm(form: BFormGroup, b: BFormGroupInput): void {
    const bRawValue = { ...this.getFormDefaults(), ...b };
    form.reset(
      {
        ...bRawValue,
        id: { value: bRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): BFormDefaults {
    return {
      id: null,
    };
  }
}
