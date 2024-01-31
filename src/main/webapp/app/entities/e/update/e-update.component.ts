import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IE } from '../e.model';
import { EService } from '../service/e.service';
import { EFormService, EFormGroup } from './e-form.service';

@Component({
  standalone: true,
  selector: 'jhi-e-update',
  templateUrl: './e-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EUpdateComponent implements OnInit {
  isSaving = false;
  e: IE | null = null;

  editForm: EFormGroup = this.eFormService.createEFormGroup();

  constructor(
    protected eService: EService,
    protected eFormService: EFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ e }) => {
      this.e = e;
      if (e) {
        this.updateForm(e);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const e = this.eFormService.getE(this.editForm);
    if (e.id !== null) {
      this.subscribeToSaveResponse(this.eService.update(e));
    } else {
      this.subscribeToSaveResponse(this.eService.create(e));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IE>>): void {
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

  protected updateForm(e: IE): void {
    this.e = e;
    this.eFormService.resetForm(this.editForm, e);
  }
}
