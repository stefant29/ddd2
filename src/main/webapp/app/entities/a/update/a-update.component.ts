import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IE } from 'app/entities/e/e.model';
import { EService } from 'app/entities/e/service/e.service';
import { IA } from '../a.model';
import { AService } from '../service/a.service';
import { AFormService, AFormGroup } from './a-form.service';

@Component({
  standalone: true,
  selector: 'jhi-a-update',
  templateUrl: './a-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class AUpdateComponent implements OnInit {
  isSaving = false;
  a: IA | null = null;

  eSSharedCollection: IE[] = [];

  editForm: AFormGroup = this.aFormService.createAFormGroup();

  constructor(
    protected aService: AService,
    protected aFormService: AFormService,
    protected eService: EService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareE = (o1: IE | null, o2: IE | null): boolean => this.eService.compareE(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ a }) => {
      this.a = a;
      if (a) {
        this.updateForm(a);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const a = this.aFormService.getA(this.editForm);
    if (a.id !== null) {
      this.subscribeToSaveResponse(this.aService.update(a));
    } else {
      this.subscribeToSaveResponse(this.aService.create(a));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IA>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(a: IA): void {
    this.a = a;
    this.aFormService.resetForm(this.editForm, a);

    this.eSSharedCollection = this.eService.addEToCollectionIfMissing<IE>(this.eSSharedCollection, a.e);
  }

  protected loadRelationshipsOptions(): void {
    this.eService
      .query()
      .pipe(map((res: HttpResponse<IE[]>) => res.body ?? []))
      .pipe(map((eS: IE[]) => this.eService.addEToCollectionIfMissing<IE>(eS, this.a?.e)))
      .subscribe((eS: IE[]) => (this.eSSharedCollection = eS));
  }
}
