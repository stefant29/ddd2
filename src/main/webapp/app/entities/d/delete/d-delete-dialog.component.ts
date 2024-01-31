import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { ID } from '../d.model';
import { DService } from '../service/d.service';

@Component({
  standalone: true,
  templateUrl: './d-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class DDeleteDialogComponent {
  d?: ID;

  constructor(
    protected dService: DService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.dService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
