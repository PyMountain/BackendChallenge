import { AppError } from '../error/AppError';
import { Order, OrderCollection, OrderDocument } from '../model/order';
import { Product, ProductCollection, ProductDocument } from '../model/product';

interface OrderResponse {
  id: number,
  products: Product[],
  total: number
}

export default class OrderController {

  async createOrder(orderProducts: Product[]):Promise<OrderResponse> {
    if(orderProducts) {
      const productNames:string[] = orderProducts.map(product => product.name);
      const productDocs:ProductDocument[] = await ProductCollection.find({name: {$in: productNames}});
      const orderProductsWithValues: Product[] = [];

      if(productDocs.length != orderProducts.length) throw new AppError('Failed to fetch every item from the database, please verify the products specified', 400);

      productDocs.forEach(productDoc => {
        const orderProduct = orderProducts.find(orderProduct => orderProduct.name === productDoc.name);

        if(!orderProduct) throw new AppError(`Failed to fetch product ${productDoc.name} from the database`, 400);
        if(orderProduct.quantity > productDoc.quantity) throw new AppError(`Failed to process product ${productDoc.name}, insufficient quantity`, 400);

        productDoc.quantity = productDoc.quantity - orderProduct.quantity;
        orderProductsWithValues.push({
          name: orderProduct.name,
          quantity: orderProduct.quantity,
          price: productDoc.price
        });
      });

      var orderDocument:OrderDocument;
      const orderTotal = this.getOrderTotal(productDocs);
      
      try {
        orderDocument = await OrderCollection.create({
          products: orderProductsWithValues,
          total: orderTotal
        });
      } catch (err) {
        throw new AppError(`Failed to save order to the database, ${err}`, 500);
      }

      productDocs.forEach(async productDoc => await productDoc.save());

      return {
        id: orderDocument.id,
        products: orderDocument.products,
        total: orderTotal
      };

    } else throw new AppError('Failed to get order from body', 400);

  }

  /**
   * Retrieves all orders from the database
   */
  async getOrders(): Promise<OrderResponse[]> {
    const allOrders = await OrderCollection.find({});

    if(allOrders && allOrders.length > 0) return allOrders.map(order => this.toOrderResponse(order));
    else throw new AppError('Failed to retrieve orders from the database', 500) 
  }

  /**
   * Retrieves an order by a given id or _id
   * 
   * @param id id or _id of the required order
   */
  async getOrderById(id: string): Promise<OrderResponse> {
    const order = await OrderCollection.findOne({id: id});

    if(order) return this.toOrderResponse(order)
    else throw new AppError(`Failed to retrieve order with id ${id} from the database`, 404)
  }

  private toOrderResponse(order: OrderDocument): OrderResponse {
    return {
      id: order.id,
      products: order.products,
      total: order.total
    }
  }

  private getOrderTotal(productDocs: ProductDocument[]): number {
    const total = productDocs.reduce((accumulator, currentValue) => accumulator + currentValue.price, 0);
    const fixedTotal = Number(total.toFixed(2));
    return fixedTotal;
  }
}