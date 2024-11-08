import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { NavComponent } from '../../components/nav/nav.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { TextboxComponent } from '../../components/textbox/textbox.component';
import { AddTransactionInteractor } from '../../../application/usecases/add-transaction.interactor';
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

  protected addInteractor = inject(AddTransactionInteractor);

  protected transactionForm = toSignal(this.addInteractor.getTransaction());

  protected counterpartyTouched = signal(false);

  protected categoryTouched = signal(false);

  protected amountTouched = signal(false);

  protected dateTouched = signal(false);

  protected categories = Object.values(Category);

  amountMapper(value: number | undefined) {
    if (value && !isNaN(value)) return String(value);
    return '';
  }

  async submitAddTransaction() {
    const success = await this.addInteractor.addTransaction();
    if (success) {
      this.dialog().close();
    }
  }
}
