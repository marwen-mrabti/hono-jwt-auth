import { z } from 'zod';

import { createFactory } from 'hono/factory';
import { dbConnect } from '../db';
import { deleteUser } from '../db/queries';
import { DatabaseError, UserNotFoundError } from '../lib/errors';

const factory = createFactory();

export const getCurrentUserHandlers = factory.createHandlers(async (c) => {
  try {
    return c.json({ message: 'current user' });
  } catch (error) {
    console.error('🚨 current user error:', error);

    return c.json({ errors: ['failed to get user'] });
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
