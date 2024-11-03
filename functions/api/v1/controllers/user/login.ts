import { UserDTO } from 'types/client';
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

    console.log(`[LOGGING FROM /user/login]: error: ${error.message}`);
    return new InternalServerErrorResponse();
  }
};
