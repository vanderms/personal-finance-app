import { BehaviorSubject, map } from 'rxjs';
import { Transaction } from '../../domain/transaction.model';
import { Singleton } from '../../util/decorators/singleton.decorator';
import { Category, isCategory } from '../../domain/category.model';
import { StateAcessor } from '../../util/dtos/state-acessor.dto';

@Singleton()
export class AddTransactionInteractor {
  private transaction = new BehaviorSubject(new Transaction({}));

  resetTransaction() {
    this.transaction.next(new Transaction({}));
  }

  private setTransactionCategory(category: string | Category) {
    if (isCategory(category)) {
      this.transaction.next(this.transaction.value.patch({ category }));
    }
  }

  private setTransactionAmount(amount: number | string) {
    if (typeof amount === 'number') {
      this.transaction.next(this.transaction.value.patch({ amount }));
      return;
    }
    const formatted = amount.trim().replace(',', '.');
    const number = Number(formatted);
    const next = formatted === '' || isNaN(number) ? NaN : number;
    this.transaction.next(this.transaction.value.patch({ amount: next }));
  }

  private setTransactionCounterparty(counterparty: string) {
    this.transaction.next(this.transaction.value.patch({ counterparty }));
  }

  private setTransaction(value: string) {
    const date = new Date(value);
    this.transaction.next(this.transaction.value.patch({ date }));
  }

  transactionAcessors = this.transaction.pipe(map(transaction => {
    const transactionAmount = transaction.getAmount() ?? NaN;
    // const amount: StateAcessor<string> = {
    //   getValue: () => isNaN(transactionAmount) ? '' : String(transactionAmount),

    // }
    
  }))
}
