export function SignupRequest({
  email,
  password,
}: {
  email?: string;
  password?: string;
}) {
  return new Request('http://localhost:9000/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function LoginRequest({
  email,
  password,
}: {
  email?: string;
  password?: string;
}) {
  return new Request('http://localhost:9000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function DeleteUserRequest(userId: string, authToken: string | null) {
  return new Request(`http://localhost:9000/api/auth/user/delete/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authToken}`,
    },
  });
}

export function extractTokenFromCookie(
  cookieString: string | null,
  cookieName: string = 'authToken'
): string | null {
  if (!cookieString) {
    return null;
  }
  // Find the cookie name in the string
  const cookieStart = cookieString.indexOf(`${cookieName}=`);

  if (cookieStart === -1) {
    return null; // Cookie not found
  }

  // Get the position after the cookie name and equals sign
  const tokenStart = cookieStart + cookieName.length + 1;

  // Find the end of the token (either semicolon or end of string)
  const tokenEnd = cookieString.indexOf(';', tokenStart);

  // Extract the token
  if (tokenEnd === -1) {
    // Token goes to the end of the string
    return cookieString.substring(tokenStart).trim();
  } else {
    // Token ends at semicolon
    return cookieString.substring(tokenStart, tokenEnd).trim();
  }
}
