import { setCookie } from 'hono/cookie';
import { createFactory } from 'hono/factory';
import { dbConnect } from '../db';
import { insertUser } from '../db/queries';
import { cookieOpts, generateToken } from '../helpers';
import { signupValidator } from '../schemas/signup-schema';

const factory = createFactory();

export const signUpHandlers = factory.createHandlers(
  signupValidator,
  async (c) => {
    try {
      // ensure db is connected
      const db = dbConnect();
      // read validated req body
      const body = c.req.valid('json');
      const { email, password, favorite_color, favorite_animal } = body;
      //insert user into db
      const userId = await insertUser({
        db,
        email,
        password,
        favorite_animal,
        favorite_color,
      });
      // generate a JWT token
      const token = await generateToken(userId);
      // put the JWT token in the cookies
      setCookie(c, 'authToken', token, cookieOpts);
      // send success response
      return c.json(
        {
          message: 'User registered successfully',
          user: { id: userId, email },
        },
        201
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('UNIQUE constraint failed')
      ) {
        return c.json({ errors: ['Email already exists'] }, 409);
      }
      console.error('signup error: ', error);
      return c.json({ errors: ['Internal server error'] }, 500);
    }
  }
);
