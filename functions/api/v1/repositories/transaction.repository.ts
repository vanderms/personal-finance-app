import { Env } from 'types/env';
import { TransactionEntity } from '../entities/transaction.entity';
import { RecordTransactionRepository } from '../services/record-transaction.service';
import { Singleton } from 'types/client';

@Singleton()
export class TransactionRepository implements RecordTransactionRepository {
  constructor(private env: Env) {}

  async save(transaction: TransactionEntity): Promise<TransactionEntity> {
    const id = crypto.randomUUID();

    await this.env.DB.prepare(
      ` INSERT INTO ftransaction (id, user_id, counterparty, category, date, amount) VALUES (?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        transaction.getUserId(),
        transaction.getCounterparty(),
        transaction.getCategory(),
        transaction.getDate().toISOString(),
        transaction.getAmount(),
      )
      .run();

    return transaction.patch({ id });
  }
}
