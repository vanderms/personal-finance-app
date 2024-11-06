import { Env } from 'types/env';
import { getCookiesFromHeaders } from 'util/functions/extract-cookies.util';
import { UserRepository } from '../repositories/user.repository';
import { LoginService } from '../services/login.service';
import { UnauthenticatedError, UnauthorizedError } from 'util/errors/unauthenticated.error';
import { InternalServerErrorResponse, UnauthorizedResponse } from 'util/responses/responses';

export class AuthHelper {
  static async assertUserAuthStatus(
    context: EventContext<Env, any, Record<string, unknown>>,
    userId: string | undefined | null,
  ) {
    if (!userId) {
      throw new UnauthorizedError();
    }

    const loginRepository = new UserRepository(context.env);

    const loginService = new LoginService(loginRepository);

    const headers = context.request.headers;

    const cookies = getCookiesFromHeaders(headers);

    const loginCookie = cookies.get('login');

    const query = await loginService.getValidLoginAndUserByLoginId(loginCookie);

    if (!query) {
      throw new UnauthenticatedError();
    }

    if (query.user.getId() !== userId) {
      throw new UnauthorizedError();
    }
  }

  static async isAuthError(error: Error) {
    return error instanceof UnauthorizedError || error instanceof UnauthenticatedError;
  }

  static async createErrorResponse(error: Error) {
    if (error instanceof UnauthorizedError) {
      return new UnauthorizedResponse();
    }

    if (error instanceof UnauthenticatedError) {
      return new UnauthorizedResponse();
    }

    return new InternalServerErrorResponse();
  }
}
