import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IB } from '../b.model';
import { BService } from '../service/b.service';

@Component({
  standalone: true,
  templateUrl: './b-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class BDeleteDialogComponent {
  b?: IB;

  constructor(
    protected bService: BService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.bService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
