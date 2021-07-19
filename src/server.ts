import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';
import * as path from 'path';
import * as render from 'koa-ejs';
import * as serve from 'koa-static';
import * as session from 'koa-session';
import * as Router from 'koa-router';
import * as bodyParser from 'koa-bodyparser';
import createBot from './bot';
import { Simplifier } from '@dplocki/generic-conversation-bot';

const PORT: number = Number(process.env.PORT) || 3000;
const app: Koa = new Koa();
const router: Router = new Router();
const botBasket: { [key: number]: Simplifier } = {};

function addMessageToChatHistory(message: string, who: string): any {
  return {
    who,
    message,
    timestamp: new Date(),
  };
}

function getRandomName(): string {
  return Math.random().toString().substr(2, 8);
}

router.get('/', async (context: Koa.Context) => {
  if (context.path === '/favicon.ico') {
    return;
  }

  await context.render('index', {
    chatHistory: context.session.chatHistory ? context.session.chatHistory : [],
  });
});

router.post('/', async (context: Koa.Context) => {
  if (context.session.isNew) {
    context.session.chatHistory = [];
    context.session.id = getRandomName();
    botBasket[context.session.id] = createBot();
  }

  const userMessage = context.request.body.value;
  const bot = botBasket[context.session.id];

  context.session.chatHistory = [
    ...context.session.chatHistory,
    addMessageToChatHistory(userMessage, 'user'),
    addMessageToChatHistory(bot.message(userMessage), 'bot'),
  ];

  context.redirect('.');
});

app.keys = [process.env.COOKIES_KEY || 'bot-speaker-secret'];
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
