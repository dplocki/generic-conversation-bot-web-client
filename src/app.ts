import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as path from 'path';
import * as render from 'koa-ejs';
import * as serve from 'koa-static';

const app: Koa = new Koa();

app.use(serve(path.join(__dirname, '/../public')));

render(app, {
  root: path.join(__dirname, '/../public'),
  layout: 'index',
  viewExt: 'html',
  cache: false,
  debug: true,
});

app.use(async (context: Koa.Context) => {
  await context.render('index', {
    chatHistory: [],
  });
});

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
