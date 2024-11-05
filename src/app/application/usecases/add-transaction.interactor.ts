import { BehaviorSubject } from 'rxjs';
import { Transaction } from '../../domain/transaction.model';
import { Singleton } from '../../util/decorators/singleton.decorator';

@Singleton()
export class AddTransactionInteractor {
  private transaction = new BehaviorSubject(new Transaction({}));

  resetTransaction() {
    this.transaction.next(new Transaction({}));
  }

  getTransaction(){
    
  }
}
