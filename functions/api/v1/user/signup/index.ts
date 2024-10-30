import { RestResponse, User } from 'client.types';
import { InvalidStateError } from 'util/errors/invalid-state.error';

export const onRequestPost: PagesFunction<{ DB: D1Database }> = async (
  context
) => {
  try {
    const data: User = await context.request.json();

    const response: RestResponse<User> = {
      status: 200,
      message: [],
      ok: true,
      data,
    };

    const headers = {
      'content-type': 'application/json',
    };

    throw new InvalidStateError('Teste');

    return new Response(JSON.stringify(response), { headers, status: 200 });
  } catch (error) {
    switch (error.name) {
      case 'InvalidStateError':
        return new Response(JSON.stringify({ error: 'Hy there' }), {
          headers: {
            'content-type': 'application/json',
          },
        });
      default:
        return new Response(JSON.stringify({ error: 'Something wrong' }), {
          headers: {
            'content-type': 'application/json',
          },
        });
    }
  }
};
