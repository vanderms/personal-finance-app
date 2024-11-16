import { BehaviorSubject, firstValueFrom, map } from 'rxjs';
import { Transaction } from '../../domain/transaction.model';
import { Singleton } from '../../util/decorators/singleton.decorator';
import { createAfterSetDecorator } from '../../util/functions/after-set-decorator';
import {
  BadRequestFormNotification,
  ResourceCreatedNotification,
  UnknownErrorNotifcation,
} from '../../util/functions/notifcations';
import { HttpAdapter } from '../adapters/http.adapter';
import { UserNotificationAdapter } from '../adapters/user-notification.adapter';
import { UserAdapter } from '../adapters/user.adapter';

@Singleton()
export class RecordTransactionInteractor {
  constructor(
    private userAdapter: UserAdapter,
    private httpAdapter: HttpAdapter,
    private userNotificationAdapter: UserNotificationAdapter,
  ) {}

  private transaction = new BehaviorSubject(new Transaction({}));

  getTransaction() {
    return this.transaction.pipe(map((transaction) => this.addDecorators(transaction)));
  }

  resetTransaction() {
    this.transaction.next(this.addDecorators(new Transaction({})));
  }

  addDecorators(transaction: Transaction) {
    const notify = (transaction: Transaction) => {
      this.transaction.next(transaction);
    };

    transaction.setType = createAfterSetDecorator(transaction.setType.bind(transaction), notify);

    transaction.setCounterparty = createAfterSetDecorator(
      transaction.setCounterparty.bind(transaction),
      notify,
    );

    transaction.setAmount = createAfterSetDecorator(
      transaction.setAmount.bind(transaction),
      notify,
    );

    transaction.setDate = createAfterSetDecorator(transaction.setDate.bind(transaction), notify);

    transaction.setCategory = createAfterSetDecorator(
      transaction.setCategory.bind(transaction),
      notify,
    );

    return transaction;
  }

  async recordTransaction() {
    try {
      const user = await firstValueFrom(this.userAdapter.getCurrentUser());

      if (!user) {
        console.error('[RecordTransactionInteractor.recordTransaction]:: no user logged.');
        return false;
      }

      const transaction = this.transaction.value.setUserId(user.getId());

      if (!transaction.isValid()) {
        console.warn('[RecordTransactionInteractor.recordTransaction]: invalid form.');
        return false;
      }

      const response = await this.httpAdapter.post('transaction/record', transaction);

      if (response.ok) {
        console.log('[RecordTransactionInteractor.recordTransaction]: ok response.');
        this.userNotificationAdapter.push(new ResourceCreatedNotification('Transaction'));
        return true;
      }

      if (response.status === 400) {
        console.log('[RecordTransactionInteractor.recordTransaction]: bad request response.');
        this.userNotificationAdapter.push(new BadRequestFormNotification());
        return false;
      }
    } catch (error) {
      console.error(error);
    }

    console.log('[RecordTransactionInteractor.recordTransaction]: unknown error.');
    this.userNotificationAdapter.push(new UnknownErrorNotifcation());
    return false;
  }
}
