import { AuthHelper } from 'api/v1/helpers/auth.helper';
import { TransactionRepository } from 'api/v1/repositories/transaction.repository';
import { ViewTransactionsService } from 'api/v1/services/view-transactions.service';
import { Env } from 'types/env';
import { BadRequestError } from 'util/errors/bad-request.error';
import {
  BadRequestResponse,
  InternalServerErrorResponse,
  ResourceResponse,
} from 'util/responses/responses';

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const userId = context.request.url.split('/').at(-1);

    await AuthHelper.assertUserAuthStatus(context.env, context.request.headers, userId);

    const transactionRepository = new TransactionRepository(context.env);

    const transactionService = new ViewTransactionsService(transactionRepository);

    const transactions = transactionService.viewTransactions(userId);

    return new ResourceResponse(transactions);

    throw Error('');
  } catch (error) {
    console.log(`[Get transaction/[transactions]]: error: ${error.message}`);

    if (AuthHelper.isAuthError(error)) {
      return AuthHelper.createErrorResponse(error);
    }

    if (error instanceof BadRequestError) {
      return new BadRequestResponse(error);
    }

    return new InternalServerErrorResponse();
  }
};
