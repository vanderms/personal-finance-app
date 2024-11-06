import { AuthHelper } from 'api/v1/helpers/auth.helper';
import { TransactionRepository } from 'api/v1/repositories/transaction.repository';
import { AddTransactionService } from 'api/v1/services/add-transaction.service';
import { TransactionDTO } from 'types/client';
import { Env } from 'types/env';
import { InternalServerErrorResponse, OperationSuccessResponse } from 'util/responses/responses';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const dto: TransactionDTO = await context.request.json();

    await AuthHelper.assertUserAuthStatus(context, dto.id);

    const transactionRepository = new TransactionRepository(context.env);

    const transactionService = new AddTransactionService(transactionRepository);

    await transactionService.save(dto);

    return new OperationSuccessResponse();
  } catch (error) {
    if (AuthHelper.isAuthError(error)) {
      return AuthHelper.createErrorResponse(error);
    }

    return new InternalServerErrorResponse();
  }
};
