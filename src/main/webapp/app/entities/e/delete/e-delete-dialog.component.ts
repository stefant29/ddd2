import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IE } from '../e.model';
import { EService } from '../service/e.service';

@Component({
  standalone: true,
  templateUrl: './e-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class EDeleteDialogComponent {
  e?: IE;

  constructor(
    protected eService: EService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.eService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
