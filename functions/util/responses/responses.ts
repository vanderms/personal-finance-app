import { LoginEntity } from 'api/v1/entities/login.entity';
import { UserEntity } from 'api/v1/entities/user.entity';
import { RestResponse } from 'types/client';
import { Properties } from 'util/properties/properties';

const CommomHeader = {
  'Content-type': 'application/json',
} as const;

export class LoginResponse extends Response {
  constructor(login: LoginEntity, user: UserEntity) {
    super(LoginResponse.mountRestResponse(user), {
      headers: LoginResponse.mountHeaders(login),
      status: 201,
    });
  }

  static mountHeaders(login: { id: string }) {
    return {
      ...CommomHeader,
      'Set-Cookie': [
        `${Properties.COOKIES_LOGIN_KEY}=${login.id}`,
        'HttpOnly',
        'Secure',
        `Max-Age=${Properties.COOKIES_LOGIN_DURATION_IN_MILLISECONDS / 1000}`,
        'SameSite=Strict',
      ].join('; '),
    };
  }

  static mountRestResponse(user: UserEntity) {
    const response: RestResponse<UserEntity> = {
      status: 200,
      message: [],
      ok: true,
      data: user,
    };
    return JSON.stringify(response);
  }
}

export class InternalServerErrorResponse extends Response {
  constructor() {
    super(
      JSON.stringify({
        status: 500,
        ok: false,
        message: [],
        data: null,
      }),
      { headers: CommomHeader, status: 500 },
    );
  }
}

export class BadRequestResponse extends Response {
  constructor(error: Error) {
    super(
      JSON.stringify({
        status: 400,
        ok: false,
        message: error.message.split('|'),
        data: null,
      }),
      { headers: CommomHeader, status: 400 },
    );
  }
}

export class UnauthenticatedResponse extends Response {
  constructor() {
    super(
      JSON.stringify({
        status: 401,
        ok: false,
        message: [],
        data: null,
      }),
      {
        headers: {
          ...CommomHeader,
          'Set-Cookie': [
            `${Properties.COOKIES_LOGIN_KEY}=`,
            'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
            'Path=/',
            'SameSite=Strict',
          ].join('; '),
        },
        status: 401,
      },
    );
  }
}

export class UnauthorizedResponse extends Response {
  constructor() {
    super(
      JSON.stringify({
        status: 403,
        ok: false,
        message: [],
        data: null,
      }),
      { headers: CommomHeader, status: 403 },
    );
  }
}

export class OperationSuccessResponse extends Response {
  constructor() {
    super(
      JSON.stringify({
        status: 200,
        ok: true,
        message: [],
        data: null,
      }),
      { headers: CommomHeader, status: 200 },
    );
  }
}

export class ResourceResponse<T> extends Response {
  constructor(data: T) {
    super(
      JSON.stringify({
        status: 200,
        ok: true,
        message: [],
        data,
      }),
      { headers: CommomHeader, status: 201 },
    );
  }
}
