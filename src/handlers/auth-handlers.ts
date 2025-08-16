import { setCookie } from 'hono/cookie';
import { createFactory } from 'hono/factory';
import { z } from 'zod';
import { dbConnect } from '../db';
import { deleteUser, getUserById, insertUser } from '../db/queries';
import { cookieOpts, generateToken } from '../helpers';
import {
  DatabaseError,
  UserConflictError,
  UserNotFoundError,
} from '../lib/errors';
import { signupValidator } from '../middlewares/auth-middlewares';

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
      console.error('🚨 Signup error:', error);

      if (error instanceof UserConflictError) {
        return c.json(
          {
            errors: ['Email already exists'],
          },
          409
        );
      }

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

export const getUserByIdHandlers = factory.createHandlers(async (c) => {
  try {
    const db = dbConnect();
    const userId = c.req.param('id');
    if (!userId) {
      return c.json(
        {
          errors: ['please provide a valid user id'],
        },
        400
      );
    }
    const user = await getUserById({ db, userId });
    return c.json({ user });
  } catch (error) {
    if (error instanceof UserNotFoundError) {
      return c.json({ errors: ['User not found'] }, 404);
    }

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
});

export const deleteUserHandlers = factory.createHandlers(async (c) => {
  try {
    const db = dbConnect();
    const userId = c.req.param('id');

    // Validate userId parameter
    if (!userId) {
      return c.json(
        {
          errors: ['User ID is required'],
        },
        400
      );
    }

    // Validate UUID format (optional but recommended)
    const isIdValid = z
      .uuid('please provide a valid user id')
      .safeParse(userId);
    if (!isIdValid.success) {
      const errors = z.flattenError(isIdValid.error);
      console.log(errors);
      return c.json(
        {
          errors: errors.formErrors,
        },
        400
      );
    }

    await deleteUser({ db, userId });

    return c.json(
      {
        message: 'User deleted successfully',
      },
      200
    );
  } catch (error) {
    console.error('🚨 delete user error:', error);

    if (error instanceof UserNotFoundError) {
      return c.json({ errors: ['User not found'] }, 404);
    }

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
});
