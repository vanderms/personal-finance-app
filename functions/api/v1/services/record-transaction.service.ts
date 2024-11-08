import { Singleton, TransactionDTO } from 'types/client';
import { BadRequestError } from 'util/errors/bad-request.error';
import { TransactionEntity } from '../entities/transaction.entity';

export interface RecordTransactionRepository {
  save(transaction: TransactionEntity): Promise<TransactionEntity>;
}

@Singleton()
export class RecordTransactionService {
  constructor(private repository: RecordTransactionRepository) {}

  save(dto: TransactionDTO) {
    const transaction = new TransactionEntity(dto);

    const errors = [
      ...transaction.counterpartyErrors(),
      ...transaction.amountErrors(),
      ...transaction.dateErrors(),
      ...transaction.categoryErrors(),
      ...transaction.userIdErrors(),
    ];

    if (errors.length !== 0) {
      throw new BadRequestError(errors.join('|'));
    }

    const saved = this.repository.save(transaction);

    return saved;
  }
}
