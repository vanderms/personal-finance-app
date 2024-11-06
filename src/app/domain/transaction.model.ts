import { Category } from './category.model';

export type TransactionDTO = {
  id?: string;
  userId?: string;
  counterparty?: string;
  category?: Category;
  date?: Date;
  amount?: number;
};

export class Transaction {
  protected readonly id?: string;
  protected readonly userId?: string;
  protected readonly counterparty?: string;
  protected readonly category?: Category;
  protected readonly date?: Date;
  protected readonly amount?: number;

  constructor(dto: TransactionDTO) {
    this.id = dto.id;
    this.userId = dto.userId;
    this.counterparty = dto.counterparty;
    this.category = dto.category;
    this.date = dto.date;
    this.amount = dto.amount;
  }

  patch(dto: TransactionDTO) {
    return new Transaction({ ...this, ...dto });
  }

  getId() {
    return this.id;
  }

  getCounterparty() {
    return this.counterparty;
  }

  getCategory() {
    return this.category;
  }

  getDate() {
    return this.date;
  }

  getAmount() {
    return this.amount;
  }

  getUserId() {
    return this.userId;
  }

  counterpartyErrors(): Set<string> {
    const errors = new Set<string>();
    if (!this.counterparty || this.counterparty.trim().length === 0) {
      errors.add(TransactionErrors.counterparty.required);
    }
    return errors;
  }

  userIdErrors() {
    const errors = new Set<string>();
    if (!this.userId || this.userId.length === 0) {
      errors.add(TransactionErrors.userId.unknown);
    }
    return errors;
  }

  categoryErrors() {
    const errors = new Set<string>();
    if (!this.category || this.category.trim().length === 0) {
      errors.add(TransactionErrors.category.required);
    }
    return errors;
  }

  dateErrors() {
    if (!this.date) {
      return new Set(TransactionErrors.date.required);
    }

    if (isNaN(this.date.getTime())) {
      return new Set(TransactionErrors.date.invalid);
    }

    const local = new Date();
    const yyyy = local.getFullYear();
    const mm = String(local.getMonth()).padStart(2, '0');
    const dd = String(local.getDate()).padStart(2, '0');

    const today = new Date(`${yyyy}-${mm}-${dd}T23:59:59:999Z`);

    if (this.date.getTime() > today.getTime()) {
      return new Set(TransactionErrors.date.future);
    }

    return new Set<string>();
  }

  amountErrors() {
    if (!this.amount) {
      return new Set<string>(TransactionErrors.amount.required);
    }
    if (isNaN(this.amount)) {
      return new Set<string>(TransactionErrors.amount.number);
    }

    return new Set<string>();
  }

  isValid() {
    const errors =
      this.counterpartyErrors().size +
      this.categoryErrors().size +
      this.dateErrors().size +
      this.amountErrors().size +
      this.userIdErrors().size;

    return errors === 0;
  }
}

export const TransactionErrors = {
  counterparty: {
    required: 'Counterparty is required',
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
