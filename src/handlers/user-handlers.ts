import { createFactory } from 'hono/factory';
import { dbConnect } from '../db';
import { deleteUser, getUserById } from '../db/queries';
import { DatabaseError, UserNotFoundError } from '../lib/errors';
import { paramValidator } from '../middlewares/validator-middlewares';

const factory = createFactory();

export const getCurrentUserHandlers = factory.createHandlers(async (c) => {
  try {
    const db = dbConnect();

    const payload = c.get('jwtPayload');
    if (!payload || !payload.sub) {
      return c.json({ errors: ['Unauthorized access'] }, 401);
    }

    const userId = payload.sub as string;
    const user = await getUserById({ db, userId });

    if (!user) {
      return c.json({ errors: ['User not found'] }, 404);
    }

    return c.json({ user }, 200);
  } catch (error) {
    console.error('🚨 current user error:', error);

    return c.json({ errors: ['failed to get current user'] }, 500);
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
