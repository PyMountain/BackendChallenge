import { OrderCollection } from '../model/order';
import { Product, ProductCollection } from '../model/product';
import mockingoose from 'mockingoose';
import OrderController from '../controller/orderController';

const orderController = new OrderController();

describe('Order Controller', () => {
  it('Should be able to retrieve an existing order', async () => {
    const mockedOrdersResponse = [
      {
        id: 1,
        products: [
          {
            name: 'Arabica coffee', 
            price: 7.20,
            quantity: 1
          },
          {
            name: 'Lettuce', 
            price: 5.50,
            quantity: 1
          }
        ],
        total: 12.70
      },
      {
        id: 2,
        products: [
          {
            name: 'Arabica coffee', 
            price: 7.20,
            quantity: 1
          },
          {
            name: 'Lettuce', 
            price: 5.50,
            quantity: 1
          }
        ],
        total: 12.70
      }
    ]

    mockingoose(OrderCollection).toReturn(mockedOrdersResponse, 'find');

    try {
      const allOrdersResponse = await orderController.getOrders();
      expect(allOrdersResponse).toMatchObject(mockedOrdersResponse);
    } catch (err) {
      fail(`Retrieving existing orders returned an error ${err}`);
    }
  });

  it('Should not be able to retrieve non existent orders', async () => {
    mockingoose(OrderCollection).toReturn(undefined, 'find');

    try {
      await orderController.getOrders();
      fail('Retrieving all orders with no orders on the database was executed succesfully');
    } catch (err) {
      expect(err.message).toBe('Failed to retrieve orders from the database');
      expect(err.code).toBe(500);
    }
  });

  it(`Should be able to retrieve an specific order by id`, async () => {
    const mockedOrder = {
      id: 1,
      products: [
        {
          name: 'Arabica coffee', 
          price: 7.20,
          quantity: 1
        },
        {
          name: 'Lettuce', 
          price: 5.50,
          quantity: 1
        }
      ],
      total: 12.70
    }
    
    mockingoose(OrderCollection).toReturn(mockedOrder, 'findOne');

    try {
      const allOrdersResponse = await orderController.getOrderById("1");
      expect(allOrdersResponse).toMatchObject(mockedOrder);
    } catch (err) {
      fail(`Retrieving an existing order returned an error ${err}`);
    }
  });

  it(`Should be able to retrieve an non existent order`, async () => {
    mockingoose(OrderCollection).toReturn(undefined, 'findOne');

    try {
      await orderController.getOrderById("1");
      fail('Retrieving an non existing order executed succesfully');
    } catch (err) {
      expect(err.message).toBe('Failed to retrieve order with id 1 from the database');
      expect(err.code).toBe(404);
    }
  });


});