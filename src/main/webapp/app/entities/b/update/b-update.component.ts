import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IA } from 'app/entities/a/a.model';
import { AService } from 'app/entities/a/service/a.service';
import { IB } from '../b.model';
import { BService } from '../service/b.service';
import { BFormService, BFormGroup } from './b-form.service';

@Component({
  standalone: true,
  selector: 'jhi-b-update',
  templateUrl: './b-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class BUpdateComponent implements OnInit {
  isSaving = false;
  b: IB | null = null;

  aSSharedCollection: IA[] = [];

  editForm: BFormGroup = this.bFormService.createBFormGroup();

  constructor(
    protected bService: BService,
    protected bFormService: BFormService,
    protected aService: AService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareA = (o1: IA | null, o2: IA | null): boolean => this.aService.compareA(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ b }) => {
      this.b = b;
      if (b) {
        this.updateForm(b);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const b = this.bFormService.getB(this.editForm);
    if (b.id !== null) {
      this.subscribeToSaveResponse(this.bService.update(b));
    } else {
      this.subscribeToSaveResponse(this.bService.create(b));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IB>>): void {
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

  protected updateForm(b: IB): void {
    this.b = b;
    this.bFormService.resetForm(this.editForm, b);

    this.aSSharedCollection = this.aService.addAToCollectionIfMissing<IA>(this.aSSharedCollection, b.a);
  }

  protected loadRelationshipsOptions(): void {
    this.aService
      .query()
      .pipe(map((res: HttpResponse<IA[]>) => res.body ?? []))
      .pipe(map((aS: IA[]) => this.aService.addAToCollectionIfMissing<IA>(aS, this.b?.a)))
      .subscribe((aS: IA[]) => (this.aSSharedCollection = aS));
  }
}
