export const generateSalt = (length = 16) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
};

export const hashPassword = async (
  password: string,
  salt: Uint8Array,
  pepper: string
) => {
  const encoder = new TextEncoder();
  const pepperBytes = encoder.encode(pepper);
  const passwordBytes = encoder.encode(password);

  const saltedPepperedPassword = new Uint8Array([
    ...salt,
    ...pepperBytes,
    ...passwordBytes,
  ]);

  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    saltedPepperedPassword
  );

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));

  const saltArray = Array.from(salt);
  const saltBase64 = btoa(String.fromCharCode(...saltArray));

  return {
    salt: saltBase64,
    password: hashBase64,
  };
};

export const verifyPassword = async (
  inputPassword: string,
  storedHash: string,
  storedSalt: string,
  pepper: string
) => {
  const saltBytes = Uint8Array.from(atob(storedSalt), (c) => c.charCodeAt(0));

  const encoder = new TextEncoder();
  const pepperBytes = encoder.encode(pepper);
  const saltedPepperedPassword = new Uint8Array([
    ...saltBytes,
    ...pepperBytes,
    ...encoder.encode(inputPassword),
  ]);

  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    saltedPepperedPassword
  );

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));

  return hashBase64 === storedHash;
};
