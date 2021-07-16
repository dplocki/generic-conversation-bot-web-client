import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as path from 'path';
import * as render from 'koa-ejs';
import * as serve from 'koa-static';
import * as session from 'koa-session';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import bot from './bot';

const PORT: number = Number(process.env.PORT) || 3000;
const app: Koa = new Koa();
const router: Router = new Router();

router.get('/', async (context: any) => {
  if (context.path === '/favicon.ico') {
    return;
  }

  await context.render('index', {
    chatHistory: context.session.chatHistory ? context.session.chatHistory : [],
  });
});

router.post('/', async (context) => {
  if (context.session.isNew) {
    context.session.chatHistory = [];
  }

  context.session.chatHistory = [
    ...context.session.chatHistory,
    {
      timestamp: new Date(),
      who: 'user',
      message: context.request.body.value,
    },
    {
      message: bot.message(context.request.body.value),
      timestamp: new Date(),
      who: 'bot',
    },
  ];

  context.redirect('.');
});

app.keys = ['secret'];
app.use(bodyParser());
app.use(session({}, app));

render(app, {
  root: path.join(__dirname, '/../public'),
  layout: 'index',
  viewExt: 'html',
  cache: false,
  debug: false,
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

app
  .on('error', console.error)
  .use(router.routes())
  .use(serve(path.join(__dirname, '/../public')))
  .use(router.allowedMethods())
  .listen(PORT);
