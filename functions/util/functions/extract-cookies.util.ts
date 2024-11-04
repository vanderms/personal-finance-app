export function getCookiesFromHeaders(headers: Headers) {
  const cookies = new Map();

  const cookieHeader = headers.get('cookie');
  if (!cookieHeader) {
    return cookies;
  }

  cookieHeader.split(';').forEach((cookie) => {
    const [name, value] = cookie.split('=');
    cookies.set(name.trim(), decodeURIComponent(value));
  });

  return cookies;
}
