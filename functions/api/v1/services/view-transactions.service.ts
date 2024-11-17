import { Singleton, TransactionDTO } from 'types/client';
import { TransactionEntity } from '../entities/transaction.entity';

export interface ViewTransactionRepository {
  getTransactionsByUserId(id: string): Promise<Set<TransactionDTO>>;
}

@Singleton()
export class ViewTransactionsService {
  constructor(private repository: ViewTransactionRepository) {}

  async viewTransactions(userId: string): Promise<Set<TransactionDTO>> {
    const transactions = await this.repository.getTransactionsByUserId(userId);

    console.log(`[ViewTransactionsService.viewTransactions] success: returning dto set.`);
    return transactions;
  }
}
