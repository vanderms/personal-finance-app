import { RestResponse } from 'client.types';

export async function onRequestPost(context) {
  const response: RestResponse = {
    status: 200,
    message: [],
    ok: true,
    data: context.request.body,
  };

  const headers = {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  return new Response(JSON.stringify(response), { headers, status: 200 });
}
