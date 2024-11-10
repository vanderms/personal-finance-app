import { Env } from 'types/env';
import { getCookiesFromHeaders } from 'util/functions/extract-cookies.util';
import { UserRepository } from '../repositories/user.repository';
import { LoginService } from '../services/login.service';
import { UnauthenticatedError, UnauthorizedError } from 'util/errors/unauthenticated.error';
import { InternalServerErrorResponse, UnauthorizedResponse } from 'util/responses/responses';

export class AuthHelper {
  static async assertUserAuthStatus(env: Env, headers: Headers, userId: string | undefined | null) {
    if (!userId) {
      throw new UnauthorizedError();
    }

    const loginRepository = new UserRepository(env);

    const loginService = new LoginService(loginRepository);

    const cookies = getCookiesFromHeaders(headers);

    const loginCookie = cookies.get('login');

    if (!loginCookie) {
      console.log(`[AuthHelper.assertUserAuthStatus] error: login cookie is not defined.`);
      throw new UnauthenticatedError();
    }

    const query = await loginService.getValidLoginAndUserByLoginId(loginCookie);

    if (!query) {
      console.log(`[AuthHelper.assertUserAuthStatus] error: valid login not found.`);
      throw new UnauthenticatedError();
    }

    if (query.user.getId() !== userId) {
      console.log(`[AuthHelper.assertUserAuthStatus] error: login.user.id !== user.id.`);
      throw new UnauthorizedError();
    }

    console.log(`[AuthHelper.assertUserAuthStatus] success.`);
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
