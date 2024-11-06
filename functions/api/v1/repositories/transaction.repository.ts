import { Env } from 'types/env';
import { TransactionEntity } from '../entities/transaction.entity';
import { AddTransactionRepository } from '../services/add-transaction.service';
import { Singleton } from 'types/client';

@Singleton()
export class TransactionRepository implements AddTransactionRepository {
  constructor(private env: Env) {}

  async save(transaction: TransactionEntity): Promise<TransactionEntity> {
    const id = crypto.randomUUID();

    await this.env.DB.prepare(
      ` INSERT INTO user (id, username, email, password, salt) VALUES (?, ?, ?, ?, ?)`,
    )
      .bind(
        id,
        transaction.getCounterparty(),
        transaction.getCategory(),
        transaction.getDate().toISOString(),
        transaction.getAmount(),
      )
      .run();

    return transaction.patch({ id });
  }
}
