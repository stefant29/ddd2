import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IC } from '../c.model';
import { CService } from '../service/c.service';

@Component({
  standalone: true,
  templateUrl: './c-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class CDeleteDialogComponent {
  c?: IC;

  constructor(
    protected cService: CService,
    protected activeModal: NgbActiveModal,
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.cService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
