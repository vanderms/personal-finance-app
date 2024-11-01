import { RestResponse, UserDTO } from 'types/client';
import { Env } from 'types/env';
import { UserRepository } from '../user.repository';
import { LoginService } from './login.service';
import { UnauthenticatedError } from 'util/errors/unauthenticated.error';
import {
  BadRequestResponse,
  createInternalServerErrorResponse,
  UnauthenticatedResponse,
} from 'util/errors/responses';
import { BadRequestError } from 'util/errors/bad-request.error';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const dto: UserDTO = await context.request.json();

    const repository = UserRepository.getInstance(context.env);

    const loginService = LoginService.getInstance(repository);

    const login = await loginService.login(dto);

    const headers = {
      'content-type': 'application/json',
      'Set-Cookie': `
        ${LoginService.COOKIES_KEY}=${login.id}; 
        HttpOnly; 
        Secure; 
        Max-Age=${LoginService.COOKIES_DURATION}; 
        SameSite=Strict`,
    };

    const response: RestResponse = {
      status: 200,
      message: [],
      ok: true,
    };

    return new Response(JSON.stringify(response), {
      headers,
      status: response.status,
    });
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return new UnauthenticatedResponse(error);
    }
    if (error instanceof BadRequestError) {
      return new BadRequestResponse(error);
    }

    console.log(`[LOGGING FROM /user/login]: error: ${error.message}`);
    return createInternalServerErrorResponse();
  }
};
