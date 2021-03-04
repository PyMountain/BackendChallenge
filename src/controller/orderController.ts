import { AppError } from '../error/AppError';
import { Order, OrderCollection, OrderDocument } from '../model/order';
import { Product, ProductCollection, ProductDocument } from '../model/product';

export default class OrderController {

  async createOrder(orderProducts: Product[]):Promise<Order> {
    if(orderProducts) {
      const productNames:string[] = orderProducts.map(product => product.name);
      const orderProductsDocs:ProductDocument[] = await ProductCollection.find({name: {$in: productNames}});

      if(orderProductsDocs.length != orderProducts.length) throw new AppError('Failed to fetch every item from the database, please verify the products specified', 400);

      orderProductsDocs.forEach(productDoc => {
        const orderProduct = orderProducts.find(orderProduct => orderProduct.name === productDoc.name);

        if(!orderProduct) throw new AppError(`Failed to fetch product ${productDoc.name} from the database`, 400);
        if(orderProduct.quantity > productDoc.quantity) throw new AppError(`Failed to process product ${productDoc.name}, insufficient quantity`, 400);

        productDoc.quantity = productDoc.quantity - orderProduct.quantity;
      });

      var orderDocument:OrderDocument;
      
      try {
        const orderTotal = orderProducts.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);
        orderDocument = await OrderCollection.create({
          products: orderProductsDocs,
          total: orderTotal
        });
      } catch (err) {
        throw new AppError(`Failed to save order to the database, ${err}`, 500);
      }

      orderProductsDocs.forEach(async productDoc => await productDoc.save());

      return orderDocument;

    } else throw new AppError('Failed to get order from body', 400);

  }

  /**
   * Retrieves all orders from the database
   */
  async getOrders(): Promise<Order[]> {
    const allOrders = await OrderCollection.find({});

    if(allOrders.length > 0) return allOrders
    else throw new AppError('Failed to retrieve orders from the database', 500) 
  }

  /**
   * retrieves an order by a given id or _id
   * 
   * @param id id or _id of the required order
   */
  async getOrderById(id: string): Promise<Order> {
    const order = await OrderCollection.findOne({$or: [{_id: id}, {id: id}]});

    if(!order) throw new AppError(`Failed to retrieve order with id ${id} from the database`, 404);

    return order;
  }
}