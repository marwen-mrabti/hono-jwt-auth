import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { jwt } from 'hono/jwt';
import { logger } from 'hono/logger';
import { deleteUserHandlers, signUpHandlers } from './handlers/auth-handlers';

const app = new Hono();

app
  .use(logger())
  .use('/api/*', csrf())
  .use(
    '/api/auth/*',
    jwt({ secret: process.env.JWT_SECRET!, cookie: 'authToken' })
  )
  .post('/api/signup', ...signUpHandlers)
  // .get('/api/auth/user/:id', )
  .delete('/api/auth/user/delete/:id', ...deleteUserHandlers);

export default {
  port: Number(process.env.PORT),
  fetch: app.fetch,
};
