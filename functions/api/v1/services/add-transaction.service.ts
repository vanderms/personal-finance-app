import { Singleton, TransactionDTO } from 'types/client';
import { BadRequestError } from 'util/errors/bad-request.error';
import { TransactionEntity } from '../entities/transaction.entity';

export interface AddTransactionRepository {
  save(transaction: TransactionEntity): Promise<TransactionEntity>;
}

@Singleton()
export class AddTransactionService {
  constructor(private repository: AddTransactionRepository) {}

  save(dto: TransactionDTO) {
    const transaction = new TransactionEntity(dto);

    const errors = [
      ...transaction.counterpartyErrors(),
      ...transaction.amountErrors(),
      ...transaction.dateErrors(),
      ...transaction.categoryErrors(),
    ];

    if (errors.length !== 0) {
      throw new BadRequestError(errors.join('|'));
    }

    const saved = this.repository.save(transaction);

    return saved;
  }
}
