export const generateSalt = (length = 16) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return array;
};

export const hashPassword = async (password: string, salt: Uint8Array) => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const saltedPassword = new Uint8Array([...salt, ...passwordBuffer]);

  // worker max execution time does not recommend a slower hash function
  const hashBuffer = await crypto.subtle.digest('SHA-256', saltedPassword);

  const decoder = new TextDecoder('utf-8');

  return {
    salt: decoder.decode(salt),
    password: decoder.decode(new Uint8Array(hashBuffer)),
  };
};

export const verifyPassword = async (
  inputPassword: string,
  storedHash: string,
  storedSalt: string
) => {
  const encoder = new TextEncoder();
  const salt = encoder.encode(storedSalt);

  const saltedPassword = new Uint8Array([
    ...salt,
    ...encoder.encode(inputPassword),
  ]);
  const hashBuffer = await crypto.subtle.digest('SHA-256', saltedPassword);

  const hash = new TextDecoder('utf-8').decode(new Uint8Array(hashBuffer));

  return hash === storedHash;
};
