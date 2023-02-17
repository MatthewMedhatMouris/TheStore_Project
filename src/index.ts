import express, { Request, Response } from 'express';
import products_routes from './handlers/products';
import users_routes from './handlers/users';
import orders_routes from './handlers/orders';

const app = express();
const port = 3000;


app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send(`**Welcome To Our Store**`);
});

products_routes(app);
orders_routes(app);
users_routes(app);

app.listen(port, async (): Promise<void> => {
  await console.log(`server started at localhost:${port}`);
});


export default app;