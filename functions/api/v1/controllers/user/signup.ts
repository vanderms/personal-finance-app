import { LoginService } from 'api/v1/services/login.service';
import { UserDTO } from 'types/client';
import { Env } from 'types/env';
import { BadRequestError } from 'util/errors/bad-request.error';
import {
  BadRequestResponse,
  InternalServerErrorResponse,
  LoginResponse,
} from 'util/responses/responses';
import { UserRepository } from '../../repositories/user.repository';
import { SignupService } from '../../services/signup.service';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const dto: UserDTO = await context.request.json();

    const userRepository = new UserRepository(context.env);

    const signupService = new SignupService(userRepository);

    const loginService = new LoginService(userRepository);

    const user = await signupService.signup(dto);

    const login = await loginService.createLogin(user);

    return new LoginResponse(login, user);
    //
  } catch (error) {
    if (error instanceof BadRequestError) {
      return new BadRequestResponse(error);
    }
    console.log(`[LOGGING FROM /user/signup]: error: ${error.message}`);
    return new InternalServerErrorResponse();
  }
};
