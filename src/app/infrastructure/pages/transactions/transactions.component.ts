import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { NavComponent } from '../../components/nav/nav.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { TextboxComponent } from '../../components/textbox/textbox.component';
import { RecordTransactionInteractor } from '../../../application/usecases/record-transaction.interactor';
import { toSignal } from '@angular/core/rxjs-interop';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { DropdownOptionComponent } from '../../components/dropdown-option/dropdown-option.component';
import { Category } from '../../../domain/category.model';
import { SelectComponent } from '../../components/select/select.component';

type Touched = {
  counterparty: boolean;
  category: boolean;
  amount: boolean;
  date: boolean;
};

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    NavComponent,
    DialogComponent,
    TextboxComponent,
    DropdownComponent,
    DropdownOptionComponent,
    SelectComponent,
  ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsComponent {
  protected dialog = viewChild.required(DialogComponent);

  protected addInteractor = inject(RecordTransactionInteractor);

  protected transactionForm = toSignal(this.addInteractor.getTransaction());

  protected counterpartyTouched = signal(false);

  protected categoryTouched = signal(false);

  protected amountTouched = signal(false);

  protected dateTouched = signal(false);

  markAllAsTouched() {
    this.categoryTouched.set(true);
    this.counterpartyTouched.set(true);
    this.dateTouched.set(true);
    this.amountTouched.set(true);
  }

  markAllAsUnTouched() {
    this.categoryTouched.set(false);
    this.counterpartyTouched.set(false);
    this.dateTouched.set(false);
    this.amountTouched.set(false);
  }

  protected categories = Object.values(Category);

  openRecordTransactionDialog() {
    this.addInteractor.resetTransaction();
    this.markAllAsUnTouched();
    this.dialog().showModal();
  }

  amountMapper(value: number | undefined) {
    if (value && !isNaN(value)) return String(value);
    return '';
  }

  async submitRecordTransactionForm(e: Event) {
    e.preventDefault();
    const success = await this.addInteractor.addTransaction();
    if (success) {
      this.dialog().close();
    } else {
      this.markAllAsTouched();
    }
  }
}
