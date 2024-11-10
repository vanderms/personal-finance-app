import { Env } from 'types/env';
import { TransactionEntity } from '../entities/transaction.entity';
import { RecordTransactionRepository } from '../services/record-transaction.service';
import { Singleton } from 'types/client';

@Singleton()
export class TransactionRepository implements RecordTransactionRepository {
  constructor(private env: Env) {}

  async save(transaction: TransactionEntity): Promise<TransactionEntity> {
    const id = crypto.randomUUID();

    const saved = transaction.setId(id);

    console.log(JSON.stringify(saved));

    await this.env.DB.prepare(
      ` INSERT INTO ftransaction (id, user_id, counterparty, category, date, amount) VALUES (?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        saved.getId(),
        saved.getUserId(),
        saved.getCounterparty(),
        saved.getCategory(),
        saved.getDate(),
        saved.getAmount(),
      )
      .run();

    return saved;
  }
}
