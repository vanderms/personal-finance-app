import { Singleton } from 'types/client';
import { TransactionEntity } from '../entities/transaction.entity';

export interface ViewTransactionRepository {
  getTransactionsByUserId(id: number): Promise<Set<TransactionEntity>>;
}

@Singleton()
export class ViewTransactionsService {
  constructor(private repository: ViewTransactionRepository) {}

  viewTransactions(id: number): Promise<Set<TransactionEntity>> {
    
    throw Error();
  }
}
