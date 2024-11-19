import { BehaviorSubject, combineLatest, filter, firstValueFrom, map, switchMap } from 'rxjs';
import { Transaction, TransactionDTO } from '../../domain/transaction.model';
import { Singleton } from '../../util/decorators/singleton.decorator';
import { FailedToFetchDataNotification } from '../../util/functions/notifcations';
import { HttpAdapter } from '../adapters/http.adapter';
import { UserNotificationAdapter } from '../adapters/user-notification.adapter';
import { UserAdapter } from '../adapters/user.adapter';

@Singleton()
export class ViewTransactionsInteractor {
  constructor(
    private userAdapter: UserAdapter,
    private httpAdapter: HttpAdapter,
    private notificationAdapter: UserNotificationAdapter,
  ) {}

  private cache = new BehaviorSubject<Transaction[] | undefined>(undefined);

  private filters = new BehaviorSubject({
    search: '',
    sort: 'Latest',
    filter: AllTransactions,
  });

  setSearch(search: string) {
    this.filters.next({ ...this.filters.value, search });
  }

  setSort(sort: string) {
    this.filters.next({ ...this.filters.value,  sort });
  }

  setFilter(filter: string) {
    this.filters.next({ ...this.filters.value, filter });
  }

  getFilters() {
    return this.filters.asObservable();
  }

  private cacheFiltered = combineLatest([this.cache, this.filters]).pipe(
    map(([transactions, filters]) => {
      if (!transactions) return transactions;
      return this.sortTransactions(transactions, filters.sort)
        .filter((transaction) => {
          return transaction.getCounterparty().includes(filters.search);
        })
        .filter((transaction) => {
          return filters.filter === AllTransactions || transaction.getCategory() === filters.filter;
        });
    }),
  );

  sortTransactions(transactions: Transaction[], sortBy: string) {
    switch (sortBy) {
      case 'Latest':
        return transactions.sort((s, o) => SortComparators['Date'](s, o));
      case 'Oldest':
        return transactions.sort((s, o) => SortComparators['Date'](s, o) * -1);
      case 'A to Z':
        return transactions.sort((s, o) => SortComparators['Counterparty'](s, o));
      case 'Z to A':
        return transactions.sort((s, o) => SortComparators['Counterparty'](s, o) * -1);
      case 'Highest':
        return transactions.sort((s, o) => SortComparators['Amount'](s, o));
      case 'Lowest':
        return transactions.sort((s, o) => SortComparators['Amount'](s, o) * -1);
    }
    console.warn('[ViewTransactionsInteractor.sortTransactions] invalid sortBy.');
    return transactions;
  }

  private transactions$ = this.cacheFiltered.pipe(
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

export const SortOptions = ['Latest', 'Oldest', 'A to Z', 'Z to A', 'Highest', 'Lowest'] as const;

export const AllTransactions = 'All Transactions';

const SortComparators: Record<string, (s: Transaction, o: Transaction) => number> = {
  Date: (self, other) => {
    if (self.getDate() > other.getDate()) return 1;
    if (other.getDate() > self.getDate()) return -1;
    return 0;
  },

  Amount: (self, other) => {
    if (self.getAmount() > other.getAmount()) return 1;
    if (other.getAmount() > self.getAmount()) return -1;
    return 0;
  },

  Counterparty: (self, other) => {
    if (self.getCounterparty() > other.getCounterparty()) return 1;
    if (other.getCounterparty() > self.getCounterparty()) return -1;
    return 0;
  },
} as const;
