import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IA } from 'app/entities/a/a.model';
import { AService } from 'app/entities/a/service/a.service';
import { ID } from '../d.model';
import { DService } from '../service/d.service';
import { DFormService, DFormGroup } from './d-form.service';

@Component({
  standalone: true,
  selector: 'jhi-d-update',
  templateUrl: './d-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class DUpdateComponent implements OnInit {
  isSaving = false;
  d: ID | null = null;

  aSSharedCollection: IA[] = [];

  editForm: DFormGroup = this.dFormService.createDFormGroup();

  constructor(
    protected dService: DService,
    protected dFormService: DFormService,
    protected aService: AService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareA = (o1: IA | null, o2: IA | null): boolean => this.aService.compareA(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ d }) => {
      this.d = d;
      if (d) {
        this.updateForm(d);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const d = this.dFormService.getD(this.editForm);
    if (d.id !== null) {
      this.subscribeToSaveResponse(this.dService.update(d));
    } else {
      this.subscribeToSaveResponse(this.dService.create(d));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ID>>): void {
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

  protected updateForm(d: ID): void {
    this.d = d;
    this.dFormService.resetForm(this.editForm, d);

    this.aSSharedCollection = this.aService.addAToCollectionIfMissing<IA>(this.aSSharedCollection, d.a);
  }

  protected loadRelationshipsOptions(): void {
    this.aService
      .query()
      .pipe(map((res: HttpResponse<IA[]>) => res.body ?? []))
      .pipe(map((aS: IA[]) => this.aService.addAToCollectionIfMissing<IA>(aS, this.d?.a)))
      .subscribe((aS: IA[]) => (this.aSSharedCollection = aS));
  }
}
