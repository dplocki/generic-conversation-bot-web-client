import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as serve from 'koa-static';
import * as path from 'path';

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

app.use(serve(path.join(__dirname, '/../public')));

app.on('error', console.error);

export default app;
