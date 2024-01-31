import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IA } from 'app/entities/a/a.model';
import { AService } from 'app/entities/a/service/a.service';
import { IC } from '../c.model';
import { CService } from '../service/c.service';
import { CFormService, CFormGroup } from './c-form.service';

@Component({
  standalone: true,
  selector: 'jhi-c-update',
  templateUrl: './c-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class CUpdateComponent implements OnInit {
  isSaving = false;
  c: IC | null = null;

  aSSharedCollection: IA[] = [];

  editForm: CFormGroup = this.cFormService.createCFormGroup();

  constructor(
    protected cService: CService,
    protected cFormService: CFormService,
    protected aService: AService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareA = (o1: IA | null, o2: IA | null): boolean => this.aService.compareA(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ c }) => {
      this.c = c;
      if (c) {
        this.updateForm(c);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const c = this.cFormService.getC(this.editForm);
    if (c.id !== null) {
      this.subscribeToSaveResponse(this.cService.update(c));
    } else {
      this.subscribeToSaveResponse(this.cService.create(c));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IC>>): void {
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

  protected updateForm(c: IC): void {
    this.c = c;
    this.cFormService.resetForm(this.editForm, c);

    this.aSSharedCollection = this.aService.addAToCollectionIfMissing<IA>(this.aSSharedCollection, c.a);
  }

  protected loadRelationshipsOptions(): void {
    this.aService
      .query()
      .pipe(map((res: HttpResponse<IA[]>) => res.body ?? []))
      .pipe(map((aS: IA[]) => this.aService.addAToCollectionIfMissing<IA>(aS, this.c?.a)))
      .subscribe((aS: IA[]) => (this.aSSharedCollection = aS));
  }
}
