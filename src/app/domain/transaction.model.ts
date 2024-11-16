import { Category, isCategory } from './category.model';

export type TransactionType = 'Expense' | 'Income' | '';

export const isTransactionType = (value: unknown): value is TransactionType => {
  return value === 'Expense' || value === 'Income';
};

export type TransactionDTO = {
  id?: string;
  userId?: string;
  type?: TransactionType;
  counterparty?: string;
  category?: string;
  date?: string;
  amount?: number | string;
};

export class Transaction {
  protected readonly id: string;
  protected readonly userId: string;
  private readonly type: TransactionType;
  protected readonly counterparty: string;
  protected readonly category: Category | '';
  protected readonly date: string;
  protected readonly amount: number;

  static regexFormDate = /^\d{4}-\d{2}-\d{2}$/;
  static regexIsoDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

  constructor(dto: TransactionDTO) {
    const orElse = <T>(x: T | undefined, d: T) => x ?? d;

    this.id = orElse(dto.id, '');

    this.userId = orElse(dto.userId, '');

    this.type = orElse(dto.type, '');

    this.counterparty = orElse(dto.counterparty, '');

    this.category = isCategory(dto.category) ? dto.category : '';

    if (dto.date && Transaction.regexFormDate.test(dto.date)) {
      this.date = dto.date + 'T00:00:00.000Z';
    } //
    else if (dto.date && Transaction.regexIsoDate.test(dto.date)) {
      this.date = dto.date;
    } //
    else {
      this.date = '';
    }

    if (typeof dto.amount === 'undefined') {
      this.amount = NaN;
    } //
    else if (typeof dto.amount === 'string' && dto.amount.trim() === '') {
      this.amount = NaN;
    } //
    else {
      dto.amount = String(dto.amount).replaceAll(',', '.');
      const dot = dto.amount.indexOf('.');
      if (dot !== -1) {
        dto.amount = dto.amount.slice(0, dot + 3);
      }
      this.amount = Number(dto.amount);
    }
  }

  getId() {
    return this.id;
  }

  setId(id: string) {
    const dto: TransactionDTO = { id };
    return new Transaction({ ...this, ...dto });
  }

  getUserId() {
    return this.userId;
  }

  setUserId(userId: string) {
    const dto: TransactionDTO = { userId };
    return new Transaction({ ...this, ...dto });
  }

  getType() {
    return this.type;
  }

  setType(type: TransactionType | string) {
    if (isTransactionType(type)) {
      const dto: TransactionDTO = { type };
      return new Transaction({ ...this, ...dto });
    }
    return this;
  }

  getCounterparty() {
    return this.counterparty;
  }

  setCounterparty(counterparty: string) {
    const dto: TransactionDTO = { counterparty };
    return new Transaction({ ...this, ...dto });
  }

  getCategory() {
    return this.category;
  }

  setCategory(category: string) {
    const dto: TransactionDTO = { category };
    return new Transaction({ ...this, ...dto });
  }

  getDate() {
    return this.date;
  }

  setDate(date: string) {
    const dto: TransactionDTO = { date };
    return new Transaction({ ...this, ...dto });
  }

  getAmount() {
    return this.amount;
  }

  setAmount(amount: number | string) {
    const dto: TransactionDTO = { amount };
    return new Transaction({ ...this, ...dto });
  }

  getTypeErrors(): Set<string> {
    const errors = new Set<string>();
    if (this.type === '') {
      errors.add(TransactionErrors.type.required);
    } else if (this.type !== 'Expense' && this.type !== 'Income') {
      errors.add(TransactionErrors.type.invalid);
    }
    return errors;
  }

  getCounterpartyErrors(): Set<string> {
    const errors = new Set<string>();
    if (!this.counterparty || this.counterparty.trim().length === 0) {
      errors.add(TransactionErrors.counterparty.required);
    }
    return errors;
  }

  getUserIdErrors() {
    const errors = new Set<string>();
    if (!this.userId || this.userId.length === 0) {
      errors.add(TransactionErrors.userId.unknown);
    }
    return errors;
  }

  getCategoryErrors() {
    const errors = new Set<string>();
    if (!this.category || this.category.trim().length === 0) {
      errors.add(TransactionErrors.category.required);
    }
    return errors;
  }

  getDateErrors() {
    if (!this.date) {
      return new Set([TransactionErrors.date.required]);
    }

    if (isNaN(new Date(this.date).getTime())) {
      return new Set([TransactionErrors.date.invalid]);
    }

    const local = new Date();
    const yyyy = local.getFullYear();
    const mm = String(local.getMonth() + 1).padStart(2, '0');
    const dd = String(local.getDate()).padStart(2, '0');

    const today = `${yyyy}-${mm}-${dd}T23:59:59.999Z`;

    if (this.date > today) {
      return new Set([TransactionErrors.date.future]);
    }

    return new Set<string>();
  }

  getAmountErrors() {
    if (isNaN(this.amount)) {
      return new Set<string>([TransactionErrors.amount.number]);
    }

    return new Set<string>();
  }

  isValid() {
    const errors =
      this.getCounterpartyErrors().size +
      this.getCategoryErrors().size +
      this.getDateErrors().size +
      this.getAmountErrors().size +
      this.getUserIdErrors().size;

    return errors === 0;
  }
}

export const TransactionErrors = {
  counterparty: {
    required: 'Recipient / Sender is required',
  },
  type: {
    required: 'Type is required',
    invalid: 'Invalid type value',
  },
  userId: {
    unknown: 'Unknown user',
  },
  category: {
    required: 'Category is required',
  },
  date: {
    required: 'Date is required',
    invalid: 'Invalid date',
    future: 'Recording future transactions is not permitted',
  },
  amount: {
    required: 'Amount is required',
    number: 'Amount must be a number',
  },
};
