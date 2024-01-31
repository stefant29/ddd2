import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IE, NewE } from '../e.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IE for edit and NewEFormGroupInput for create.
 */
type EFormGroupInput = IE | PartialWithRequiredKeyOf<NewE>;

type EFormDefaults = Pick<NewE, 'id'>;

type EFormGroupContent = {
  id: FormControl<IE['id'] | NewE['id']>;
  name: FormControl<IE['name']>;
};

export type EFormGroup = FormGroup<EFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EFormService {
  createEFormGroup(e: EFormGroupInput = { id: null }): EFormGroup {
    const eRawValue = {
      ...this.getFormDefaults(),
      ...e,
    };
    return new FormGroup<EFormGroupContent>({
      id: new FormControl(
        { value: eRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(eRawValue.name),
    });
  }

  getE(form: EFormGroup): IE | NewE {
    return form.getRawValue() as IE | NewE;
  }

  resetForm(form: EFormGroup, e: EFormGroupInput): void {
    const eRawValue = { ...this.getFormDefaults(), ...e };
    form.reset(
      {
        ...eRawValue,
        id: { value: eRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EFormDefaults {
    return {
      id: null,
    };
  }
}
