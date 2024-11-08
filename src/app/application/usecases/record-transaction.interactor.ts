import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Transaction, TransactionDTO } from '../../domain/transaction.model';
import { Singleton } from '../../util/decorators/singleton.decorator';
import { UserAdapter } from '../adapters/user.adapter';
import { HttpAdapter } from '../adapters/http.adapter';
import { UserNotificationAdapter } from '../adapters/user-notification.adapter';

@Singleton()
export class RecordTransactionInteractor {
  constructor(
    private userAdapter: UserAdapter,
    private httpAdapter: HttpAdapter,
    private userNotificationAdapter: UserNotificationAdapter,
  ) {}

  private transaction = new BehaviorSubject(new Transaction({}));

  resetTransaction() {
    this.transaction.next(new Transaction({}));
  }

  getTransaction() {
    return this.transaction;
  }

  patchTransaction(dto: TransactionDTO) {
    const current = this.transaction.value;
    this.transaction.next(current.patch(dto));
  }

  async addTransaction() {
    try {
      const user = await firstValueFrom(this.userAdapter.getCurrentUser());

      if (!user) {
        return false;
      }

      const transaction = this.transaction.value.patch({ userId: user.getId() });

      if (!transaction.isValid()) {
        return false;
      }

      const response = await this.httpAdapter.post('transaction/record', transaction);

      if (response.ok) {
        return true;
      }

      if (response.status === 400) {
        this.userNotificationAdapter.push(this.feedback.BadRequest);
        return false;
      }
    } catch (error) {
      console.error(error);
    }

    this.userNotificationAdapter.push(this.feedback.Unknown);
    return false;
  }

  readonly feedback = {
    Ok: {
      title: 'Success',
      text: 'Transaction was created successfully!',
      type: 'info',
      primaryAction: 'Continue',
    },
    BadRequest: {
      title: 'Error',
      text: 'The form has errors, please correct them before submitting it again.',
      type: 'danger',
      primaryAction: 'Close',
    },
    Unknown: {
      title: 'Error',
      text: 'An unexpected error occurred. Please try again later.',
      type: 'danger',
      primaryAction: 'Close',
    },
  } as const;
}
