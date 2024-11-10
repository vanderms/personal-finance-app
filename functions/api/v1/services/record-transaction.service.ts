import { Singleton, TransactionDTO } from 'types/client';
import { BadRequestError } from 'util/errors/bad-request.error';
import { TransactionEntity } from '../entities/transaction.entity';

export interface RecordTransactionRepository {
  save(transaction: TransactionEntity): Promise<TransactionEntity>;
}

@Singleton()
export class RecordTransactionService {
  constructor(private repository: RecordTransactionRepository) {}

  async save(dto: TransactionDTO) {
    const transaction = new TransactionEntity(dto);

    const errors = [
      ...transaction.getCounterpartyErrors(),
      ...transaction.getAmountErrors(),
      ...transaction.getDateErrors(),
      ...transaction.getCategoryErrors(),
      ...transaction.getUserIdErrors(),
    ];

    if (errors.length !== 0) {
      console.log(`[RecordTransactionService.save] bad request error`);
      throw new BadRequestError(errors.join('|'));
    }

    const saved = await this.repository.save(transaction);

    console.log(`[RecordTransactionService.save] success saved`);

    return saved;
  }
}
