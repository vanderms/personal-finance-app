import { Properties } from 'util/properties/properties';

const headerJSON = {
  'Content-type': 'application/json',
} as const;

export class InternalServerErrorResponse extends Response {
  constructor() {
    super(
      JSON.stringify({
        status: 500,
        ok: false,
        message: [],
        data: null,
      }),
      { headers: headerJSON, status: 400 }
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
      { headers: headerJSON, status: 400 }
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
          ...headerJSON,
          'Set-Cookie': [
            `${Properties.COOKIES_LOGIN_KEY}=`,
            'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
            'Path=/',
            'SameSite=Strict',
          ].join('; '),
        },
        status: 401,
      }
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
      { headers: headerJSON, status: 403 }
    );
  }
}
