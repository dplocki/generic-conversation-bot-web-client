import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';

const app: Koa = new Koa();

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

app.on('error', console.error);

export default app;
