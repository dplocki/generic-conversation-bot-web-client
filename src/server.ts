import app from './app';
import router from './router';

const PORT:number = Number(process.env.PORT) || 3000;

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);
