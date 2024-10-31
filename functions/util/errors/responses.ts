import { RestResponse } from 'types/client';

const headers = {
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
    headers,
    status: response.status,
  });
};

export const createBadRequestErrorResponse = (message: string) => {
  const response: RestResponse = {
    status: 400,
    ok: false,
    message: message.split('|'),
  };
  return new Response(JSON.stringify(response), {
    headers,
    status: response.status,
  });
};
