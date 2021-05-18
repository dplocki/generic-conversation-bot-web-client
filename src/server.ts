import app from './app';
import router from './router';
import * as serve from 'koa-static';
import * as path from 'path';

const PORT:number = Number(process.env.PORT) || 3000;

app
  .use(router.allowedMethods());

app.listen(PORT);
