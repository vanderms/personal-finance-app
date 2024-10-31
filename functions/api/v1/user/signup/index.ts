import { RestResponse, UserDTO } from 'types/client';
import { BadRequestError } from 'util/errors/bad-request.error';
import {
  BadRequestResponse,
  createInternalServerErrorResponse
} from 'util/errors/responses';
import { UserEntity } from '../user.entity';
import { UserRepository } from '../user.repository';
import { SignupService } from './signup.service';

interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const dto: UserDTO = await context.request.json();

    const signupRepository = UserRepository.getInstance(context.env.DB);

    const signupService = SignupService.getInstance(signupRepository);

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
    if (error.name === BadRequestError.name) {
      return new BadRequestResponse(error);
    }
    console.log(`[LOGGING FROM /user/signup]: error: ${error.message}`);
    return createInternalServerErrorResponse();
  }
};
