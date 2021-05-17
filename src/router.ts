import * as Router from 'koa-router';

const router: Router = new Router();

router
  .get('/', async (context) => {
    context.body = 'Hello world!';
  });

export default router;
