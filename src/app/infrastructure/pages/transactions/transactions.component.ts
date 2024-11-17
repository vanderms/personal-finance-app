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
import { ViewTransactionsInteractor } from '../../../application/usecases/view-transactions.interactor';

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

  protected viewInteractor = inject(ViewTransactionsInteractor);

  protected formTransaction = toSignal(this.addInteractor.getTransaction());

  protected counterpartyTouched = signal(false);

  protected categoryTouched = signal(false);

  protected amountTouched = signal(false);

  protected dateTouched = signal(false);

  protected typeTouched = signal(false);

  protected transactions = toSignal(this.viewInteractor.getTransactions());

  markAllAsTouched() {
    this.categoryTouched.set(true);
    this.counterpartyTouched.set(true);
    this.dateTouched.set(true);
    this.amountTouched.set(true);
    this.typeTouched.set(true);
  }

  markAllAsUnTouched() {
    this.categoryTouched.set(false);
    this.counterpartyTouched.set(false);
    this.dateTouched.set(false);
    this.amountTouched.set(false);
    this.typeTouched.set(false);
  }

  protected categories = Object.values(Category);

  openRecordTransactionDialog() {
    this.addInteractor.resetTransaction();
    this.markAllAsUnTouched();
    this.dialog().showModal();
  }

  convertAmount(value: number | undefined) {
    if (value && !isNaN(value)) return String(value);
    return '';
  }

  convertDate(date: string) {
    if (!date || isNaN(new Date(date).getTime())) return '';
    const converted = date.slice(0, 10);
    return converted;
  }

  async submitRecordTransactionForm(e: Event) {
    e.preventDefault();
    const success = await this.addInteractor.recordTransaction();
    if (success) {
      this.dialog().close();
    } else {
      this.markAllAsTouched();
    }
  }
}
