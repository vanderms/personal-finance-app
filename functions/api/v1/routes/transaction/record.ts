import { AuthHelper } from 'api/v1/helpers/auth.helper';
import { TransactionRepository } from 'api/v1/repositories/transaction.repository';
import { RecordTransactionService } from 'api/v1/services/record-transaction.service';
import { TransactionDTO } from 'types/client';
import { Env } from 'types/env';
import { BadRequestError } from 'util/errors/bad-request.error';
import {
  BadRequestResponse,
  InternalServerErrorResponse,
  OperationSuccessResponse,
} from 'util/responses/responses';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const dto: TransactionDTO = await context.request.json();

    await AuthHelper.assertUserAuthStatus(context.env, context.request.headers, dto.userId);

    const transactionRepository = new TransactionRepository(context.env);

    const transactionService = new RecordTransactionService(transactionRepository);

    await transactionService.save(dto);

    console.log(`[POST transaction/record]: sending success response.`);

    return new OperationSuccessResponse();
  } catch (error) {
    //
    console.log(`[POST transaction/record]: error: ${error.message}`);

    if (AuthHelper.isAuthError(error)) {
      return AuthHelper.createErrorResponse(error);
    }

    if (error instanceof BadRequestError) {
      return new BadRequestResponse(error);
    }

    return new InternalServerErrorResponse();
  }
};
