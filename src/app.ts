import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';

const app: Koa = new Koa();

// Generic error handling middleware.
app.use(async (context: Koa.Context, next: () => Promise<any>) => {
  try {
    await next();
  } catch (error) {
    context.status = error.statusCode
      || error.status
      || HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
    error.status = context.status;
    context.body = { error };
    context.app.emit('error', error, context);
  }
});

// Initial route
app.use(async (context: Koa.Context) => {
  context.body = 'Hello world';
  context.status = HttpStatus.StatusCodes.OK;
});

// Application error logging.
app.on('error', console.error);

export default app;
