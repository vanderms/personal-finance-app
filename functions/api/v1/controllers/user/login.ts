import { RestResponse, UserDTO } from 'types/client';
import { Env } from 'types/env';
import { BadRequestError } from 'util/errors/bad-request.error';
import { UnauthenticatedError } from 'util/errors/unauthenticated.error';
import {
  BadRequestResponse,
  InternalServerErrorResponse,
  LoginResponse,
  UnauthenticatedResponse,
} from 'util/responses/responses';
import { UserRepository } from '../../repositories/user.repository';
import { LoginService } from '../../services/login.service';
import { getCookiesFromHeaders } from 'util/functions/extract-cookies.util';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const dto: UserDTO = await context.request.json();

    const repository = new UserRepository(context.env);

    const loginService = new LoginService(repository);

    const { login, user } = await loginService.login(dto);

    return new LoginResponse(login, user);
    //
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return new UnauthenticatedResponse();
    }
    if (error instanceof BadRequestError) {
      return new BadRequestResponse(error);
    }

    console.log(`[LOGGING FROM POST /user/login]: error: ${error.message}`);
    return new InternalServerErrorResponse();
  }
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const repository = new UserRepository(context.env);

    const headers = context.request.headers;

    const cookies = getCookiesFromHeaders(headers);

    const loginCookie = cookies.get('login');

    if (!loginCookie) {
      const headers = {
        'Content-type': 'application/json',
      } as const;

      const response: RestResponse<null> = {
        status: 200,
        ok: true,
        message: [],
        data: null,
      };
      return new Response(JSON.stringify(response), {
        headers,
        status: response.status,
      });
    }

    const loginService = new LoginService(repository);

    const { login, user } = await loginService.loginWithCredentials(loginCookie);

    return new LoginResponse(login, user);
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return new UnauthenticatedResponse();
    }

    console.log(`[LOGGING FROM GET /user/login]: error: ${error.message}`);
    return new InternalServerErrorResponse();
  }
};
