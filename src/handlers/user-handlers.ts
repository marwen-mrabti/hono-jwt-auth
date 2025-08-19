import { createFactory } from 'hono/factory';
import { dbConnect } from '../db';
import { deleteUser } from '../db/queries';
import { DatabaseError, UserNotFoundError } from '../lib/errors';
import { paramValidator } from '../middlewares/validator-middlewares';

const factory = createFactory();

export const getCurrentUserHandlers = factory.createHandlers(async (c) => {
  try {
    return c.json({ message: 'current user' });
  } catch (error) {
    console.error('🚨 current user error:', error);

    return c.json({ errors: ['failed to get user'] });
  }
});

export const deleteUserHandlers = factory.createHandlers(
  paramValidator,
  async (c) => {
    try {
      const db = dbConnect();
      const userId = c.req.param('id') as string;

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
  }
);
