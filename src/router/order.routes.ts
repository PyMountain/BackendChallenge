import { Router } from 'express';
import OrderController from '../controller/orderController';
import { Product } from '../model/product';

const orderRouter = Router();
const orderController: OrderController = new OrderController();

orderRouter.post('/', async (req, res, next) => {
  try {
    const products = req.body.products as Product[];
    const createdOrder = await orderController.createOrder(products);

    res.status(201).json(createdOrder);
  } catch (err) {
    next(err);
  }
});

orderRouter.get('/', async (req, res, next) => {
  try {
    const retrievedOrders = await orderController.getOrders();

    res.status(200).json(retrievedOrders);
  } catch (err) {
    next(err);
  }
});

orderRouter.get('/:id', async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const retrievedOrder = await orderController.getOrderById(orderId);

    res.status(200).json(retrievedOrder);
  } catch (err) {
    next(err);
  }
});

export default orderRouter;