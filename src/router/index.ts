import { Router } from 'express';
import importRouter from './import.routes';
import productRouter from './products.routes';
import orderRouter from './order.routes';

const routes = Router();

routes.use('/import', importRouter);
routes.use('/products', productRouter);
routes.use('/orders', orderRouter);


export default routes;