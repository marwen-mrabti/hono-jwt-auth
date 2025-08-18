import { deleteCookie, setCookie } from 'hono/cookie';
import { createFactory } from 'hono/factory';

import { dbConnect } from '../db';
import { getUserByEmail, insertUser } from '../db/queries';
import { cookieOpts, generateToken } from '../helpers';
import { DatabaseError, UserConflictError } from '../lib/errors';
import {
  loginValidator,
  signupValidator,
} from '../middlewares/auth-middlewares';

const factory = createFactory();

export const signUpHandlers = factory.createHandlers(
  signupValidator,
  async (c) => {
    try {
      // Ensure db is connected
      const db = dbConnect();

      // Read validated request body
      const body = c.req.valid('json');
      const { email, password } = body;

      // Insert user into database
      const userId = await insertUser({
        db,
        email,
        password,
      });

      // Generate JWT token
      const token = await generateToken(userId);

      // Set JWT token in cookies
      setCookie(c, 'authToken', token, cookieOpts);

      // Send success response
      return c.json(
        {
          message: 'User registered successfully',
          user: {
            id: userId,
            email,
          },
        },
        201
      );
    } catch (error) {
      if (error instanceof UserConflictError) {
        return c.json(
          {
            errors: ['Email already exists'],
          },
          409
        );
      }

      console.error('🚨 Signup error:', error);
      if (error instanceof DatabaseError) {
        return c.json(
          {
            errors: ['Database error occurred. Please try again.'],
          },
          500
        );
      }

      return c.json(
        {
          errors: ['Internal server error'],
        },
        500
      );
    }
  }
);

export const loginHandlers = factory.createHandlers(
  loginValidator,
  async (c) => {
    try {
      const db = dbConnect();
      // Read validated request body
      const body = c.req.valid('json');
      const { email, password } = body;

      // fetch user with the provided email
      const user = await getUserByEmail({ db, email });
      if (!user) {
        return c.json({ errors: ['Invalid credentials'] }, 401);
      }

      // verify the password
      const isPasswordMatch = await Bun.password.verify(
        password,
        user.password_hash
      );
      if (!isPasswordMatch) {
        return c.json({ errors: ['Invalid credentials'] }, 401);
      }

      // if the passwords match,  generate JWT token and set authToken cookie
      const token = await generateToken(user.id);
      setCookie(c, 'authToken', token, cookieOpts);

      // send success response
      return c.json(
        {
          message: 'Login successful',
          user: {
            id: user.id,
            email,
          },
        },
        200
      );
    } catch (error) {
      console.log(error);
      return c.json({ errors: ['something went wrong! please try again.'] });
    }
  }
);

export const logoutHandlers = factory.createHandlers(async (c) => {
  try {
    deleteCookie(c, 'authToken', cookieOpts);
    return c.json({ message: 'user logged out successfully.' }, 200);
  } catch (error) {
    console.log(error);
    return c.json({ errors: ['failed to logout! please try again.'] }, 500);
  }
});
