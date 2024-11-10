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

    const preparedArgs = [
      saved.getId(),
      saved.getUserId(),
      saved.getCounterparty(),
      saved.getCategory(),
      saved.getDate(),
      saved.getAmount(),
    ];

    console.log(`TransactionRepository.save:: saving args: (${JSON.stringify(preparedArgs)})`);

    await this.env.DB.prepare(
      ` INSERT INTO ftransaction (id, user_id, counterparty, category, date, amount) VALUES (?, ?, ?, ?, ?, ?)`,
    )
      .bind(...preparedArgs)
      .run();

    console.log(`TransactionRepository.save:: transaction saved.`);

    return saved;
  }
}
