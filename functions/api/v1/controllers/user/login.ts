import { RestResponse, UserDTO } from 'types/client';
import { Env } from 'types/env';
import { BadRequestError } from 'util/errors/bad-request.error';
import {
  BadRequestResponse,
  InternalServerErrorResponse,
  UnauthenticatedResponse,
} from 'util/errors/responses';
import { UnauthenticatedError } from 'util/errors/unauthenticated.error';
import { Properties } from 'util/properties/properties';
import { UserRepository } from '../../repositories/user.repository';
import { LoginService } from '../../services/login.service';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const dto: UserDTO = await context.request.json();

    const repository = UserRepository.getInstance(context.env);

    const loginService = new LoginService(repository);

    const login = await loginService.login(dto);

    const headers = {
      'Content-Type': 'application/json',
      'Set-Cookie': [
        `${Properties.COOKIES_LOGIN_KEY}=${login.id}`,
        'HttpOnly',
        'Secure',
        `Max-Age=${Properties.COOKIES_LOGIN_DURATION_IN_MILLISECONDS / 1000}`,
        'SameSite=Strict',
      ].join('; '),
    };

    const response: RestResponse = {
      status: 200,
      message: [],
      ok: true,
      data: null,
    };

    return new Response(JSON.stringify(response), {
      headers,
      status: response.status,
    });
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return new UnauthenticatedResponse();
    }
    if (error instanceof BadRequestError) {
      return new BadRequestResponse(error);
    }

    console.log(`[LOGGING FROM /user/login]: error: ${error.message}`);
    return new InternalServerErrorResponse();
  }
};
