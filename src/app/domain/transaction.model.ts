import { Category } from './category.model';

export type TransactionDTO = {
  id?: string;
  counterparty?: string;
  category?: Category;
  date?: Date;
  amount?: number;
};

export class Transaction {
  protected readonly id?: string;
  protected readonly counterparty?: string;
  protected readonly category?: Category;
  protected readonly date?: Date;
  protected readonly amount?: number;

  constructor(dto: TransactionDTO) {
    this.id = dto.id;
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

  validateCounterparty(): Set<string> {
    const errors = new Set<string>();
    if (!this.counterparty || this.counterparty.trim().length === 0) {
      errors.add(TransactionErrors.counterparty.required);
    }
    return errors;
  }

  validateCategory() {
    const errors = new Set<string>();
    if (!this.category || this.category.trim().length === 0) {
      errors.add(TransactionErrors.category.required);
    }
    return errors;
  }

  validateDate() {
    if (!this.date) {
      return new Set(TransactionErrors.date.required);
    }

    if (isNaN(this.date.getTime())) {
      return new Set(TransactionErrors.date.invalid);
    }

    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (this.date.getTime() > today.getTime()) {
      return new Set(TransactionErrors.date.future);
    }

    return new Set<string>();
  }

  validateAmount() {
    if (!this.amount) {
      return new Set<string>(TransactionErrors.amount.required);
    }
    if (isNaN(this.amount)) {
      return new Set<string>(TransactionErrors.amount.number);
    }

    return new Set<string>();
  }
}

export const TransactionErrors = {
  counterparty: {
    required: 'Counterparty is required',
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
