

export async function onRequest() {
  return new Response("Hello World!", {
    headers: { "content-type": "text/plain" },
  });
}  