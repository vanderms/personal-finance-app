export async function onRequestPost(context) {
  return new Response(JSON.stringify(context.data), {
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
