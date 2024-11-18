import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RecordTransactionInteractor } from '../../../application/usecases/record-transaction.interactor';
import { ViewTransactionsInteractor } from '../../../application/usecases/view-transactions.interactor';
import { Category } from '../../../domain/category.model';
import { Transaction } from '../../../domain/transaction.model';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { DropdownOptionComponent } from '../../components/dropdown-option/dropdown-option.component';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { NavComponent } from '../../components/nav/nav.component';
import { SelectComponent } from '../../components/select/select.component';
import { TextboxComponent } from '../../components/textbox/textbox.component';

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

  // transactions = signal([
  //   new Transaction({
  //     counterparty: 'Farmácia',
  //     category: 'General',
  //     amount: '60.00',
  //     date: '2016-05-18T16:00:00.000Z',
  //   }),
  //   new Transaction({
  //     counterparty: 'Farmácia',
  //     category: 'General',
  //     amount: '70.00',
  //     date: '2016-05-18T16:00:00.000Z',
  //   }),
  // ]);

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

  transactionDate(value: string) {
    const date = new Date(value);
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(date);
    return formattedDate;
  }

  transactionAmount(transaction: Transaction) {
    if (transaction.getType() === 'Expense') return -transaction.getAmount();
    return transaction.getAmount();
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
