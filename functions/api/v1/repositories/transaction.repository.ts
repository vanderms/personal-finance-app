import { Env } from 'types/env';
import { TransactionEntity } from '../entities/transaction.entity';
import { RecordTransactionRepository } from '../services/record-transaction.service';
import { Singleton, TransactionDTO } from 'types/client';
import { ViewTransactionRepository } from '../services/view-transactions.service';

@Singleton()
export class TransactionRepository
  implements RecordTransactionRepository, ViewTransactionRepository
{
  constructor(private env: Env) {}

  async save(transaction: TransactionEntity): Promise<TransactionEntity> {
    const id = crypto.randomUUID();

    const saved = transaction.setId(id);

    const preparedArgs = [
      saved.getId(),
      saved.getUserId(),
      saved.getType(),
      saved.getCounterparty(),
      saved.getCategory(),
      saved.getDate(),
      saved.getAmount(),
    ];

    console.log(`[TransactionRepository.save]: saving args: (${JSON.stringify(preparedArgs)})`);

    await this.env.DB.prepare(
      ` INSERT INTO ftransaction (id, user_id, type, counterparty, category, date, amount) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(...preparedArgs)
      .run();

    console.log(`[TransactionRepository.save]: transaction saved.`);

    return saved;
  }

  async getTransactionsByUserId(userId: string): Promise<Set<TransactionDTO>> {
    console.log(`[TransactionsRepository.getTransactionByUserId] preparing query.`);

    const stmt = this.env.DB.prepare(
      `SELECT t.id, t.user_id, t.type, t.counterparty, t.category, t.date, t.amount
        FROM ftransaction t 
        WHERE t.user_id = ?`,
    ).bind(userId);

    const transactions = await stmt.run<TransactionDTO>();

    const transactionsSet = new Set(transactions.results);

    console.log(`[TransactionsRepository.getTransactionByUserId] success: returning dto set.`);

    return transactionsSet;
  }
}
