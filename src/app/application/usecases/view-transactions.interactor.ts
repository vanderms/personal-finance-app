import { BehaviorSubject, filter, firstValueFrom, switchMap } from 'rxjs';
import { Transaction, TransactionDTO } from '../../domain/transaction.model';
import { Singleton } from '../../util/decorators/singleton.decorator';
import { FailedToFetchDataNotification } from '../../util/functions/notifcations';
import { HttpAdapter } from '../adapters/http.adapter';
import { UserNotificationAdapter } from '../adapters/user-notification.adapter';
import { UserAdapter } from '../adapters/user.adapter';

export const SortOptions = ['Latest', 'Oldest', 'A to Z', 'Z to A', 'Highest', 'Lowest'] as const;

@Singleton()
export class ViewTransactionsInteractor {
  constructor(
    private userAdapter: UserAdapter,
    private httpAdapter: HttpAdapter,
    private notificationAdapter: UserNotificationAdapter,
  ) {}

  private cache = new BehaviorSubject<Transaction[] | undefined>(undefined);

  private transactions$ = this.cache.pipe(
    switchMap(async (cache) => {
      if (cache) return cache;
      const transactions = await this._requestTransactions();

      if (transactions) {
        this.cache.next(transactions);
      }
      return undefined;
    }),
    filter((x: Transaction[] | undefined): x is Transaction[] => x !== undefined),
  );

  updateCache() {
    this.cache.next(undefined);
  }

  getTransactions() {
    return this.transactions$;
  }

  async _requestTransactions() {
    console.log('[ViewTransactionsInteractor.requestTransactions] requesting transactions.');
    const user = await firstValueFrom(this.userAdapter.getCurrentUser());

    if (!user) {
      console.warn('[ViewTransactionsInteractor.requestTransactions] no user logged.');
      return undefined;
    }

    try {
      const response = await this.httpAdapter.get<TransactionDTO[]>(`transaction/${user.getId()}`);

      if (response.ok) {
        console.log('[ViewTransactionsInteractor.requestTransactions]: ok response.');
        const transactions = response.data.map((transaction) => new Transaction(transaction));
        return transactions;
      }
    } catch (error) {
      console.warn(`[ViewTransactionsInteractor.requestTransactions]: error: `, error);
      return undefined;
    }

    console.warn('[ViewTransactionsInteractor.requestTransactions]: unknown error.');
    this.notificationAdapter.push(new FailedToFetchDataNotification('user transactions'));
    return undefined;
  }
}
