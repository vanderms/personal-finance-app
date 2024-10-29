export async function onRequest() {
  return new Response(JSON.stringify({ status: 'success' }), {
    headers: { 'content-type': 'application/json' },
  });
}
