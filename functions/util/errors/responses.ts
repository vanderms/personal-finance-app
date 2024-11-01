import { RestResponse } from 'types/client';
import { Properties } from 'util/properties/properties';

const headerJSON = {
  'content-type': 'application/json',
} as const;

export const createInternalServerErrorResponse = () => {
  const response: RestResponse = {
    status: 500,
    ok: false,
    message: [
      'The server has encountered a situation it does not know how to handle.',
    ],
  };
  return new Response(JSON.stringify(response), {
    headers: headerJSON,
    status: response.status,
  });
};

export class BadRequestResponse extends Response {
  constructor(error: Error) {
    super(
      JSON.stringify({
        status: 400,
        ok: false,
        message: error.message.split('|'),
      }),
      { headers: headerJSON, status: 400 }
    );
  }
}

export class UnauthenticatedResponse extends Response {
  constructor(error: Error) {
    super(
      JSON.stringify({
        status: 401,
        ok: false,
        message: [],
      }),
      {
        headers: {
          ...headerJSON,
          'Set-Cookie': `
            ${Properties.COOKIES_LOGIN_KEY}=; 
            Expires=Thu, 01 Jan 1970 00:00:00 GMT; 
            Path=/; 
            SameSite=Strict`,
        },
        status: 401,
      }
    );
  }
}

export class UnauthorizedResponse extends Response {
  constructor(error: Error) {
    super(
      JSON.stringify({
        status: 403,
        ok: false,
        message: [],
      }),
      { headers: headerJSON, status: 403 }
    );
  }
}
