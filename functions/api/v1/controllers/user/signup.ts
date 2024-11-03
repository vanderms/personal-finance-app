import { RestResponse, UserDTO } from 'types/client';
import { Env } from 'types/env';
import { BadRequestError } from 'util/errors/bad-request.error';
import {
  BadRequestResponse,
  InternalServerErrorResponse,
} from 'util/errors/responses';
import { UserEntity } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { SignupService } from '../../services/signup.service';

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const dto: UserDTO = await context.request.json();

    const userRepository = new UserRepository(context.env);

    const signupService = new SignupService(userRepository);

    const data = await signupService.signup(dto);

    const headers = { 'content-type': 'application/json' };

    const response: RestResponse<UserEntity> = {
      status: 201,
      ok: true,
      message: [],
      data,
    };

    return new Response(JSON.stringify(response), {
      headers,
      status: response.status,
    });
    //
  } catch (error) {
    if (error instanceof BadRequestError) {
      return new BadRequestResponse(error);
    }
    console.log(`[LOGGING FROM /user/signup]: error: ${error.message}`);
    return new InternalServerErrorResponse();
  }
};
