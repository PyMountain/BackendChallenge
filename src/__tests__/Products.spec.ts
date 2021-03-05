import { ProductCollection } from '../model/product';
import mockingoose from 'mockingoose';
import ProductController from '../controller/productController';

const productController = new ProductController();

describe('Product Controller', () => {
  it('should be able to retrieve an existing product', async () => {
    const mockedProduct = {
      name: 'Arabica coffee', 
      price: 6.48,
      quantity: 2
    }

    mockingoose(ProductCollection).toReturn(mockedProduct, 'findOne');

    try{
      const productFindResponse = await productController.getProduct('Arabica coffee');
      expect(productFindResponse).toMatchObject(mockedProduct);
    } catch (err) {
      fail(`Find for a existant product returned an error, ${err}`);
    }
  });

  it('should not be able to retrieve an non existent product', async () => {
    mockingoose(ProductCollection).toReturn(undefined, 'findOne');

    try {
      await productController.getProduct('Arabica coffee');
      fail('Find for a non existant product did not returned an error');
    } catch (err) {
      expect(err.message).toBe('Could not get product with name Arabica coffee');
      expect(err.code).toBe(404);
    }
  });

  it('should be able to increase a existent product quantity', async () => {
    const mockedProduct = {
      name: 'Arabica coffee', 
      price: 6.48,
      quantity: 0
    }

    mockingoose(ProductCollection).toReturn(mockedProduct, 'findOne');
    mockingoose(ProductCollection).toReturn(mockedProduct, 'save');

    try {
      await productController.updateProductQuantity('Arabica coffee', 'INCREASE');
      expect(true).toBe(true);
    } catch (err) {
      fail(`Increase quantity for a valid product returned an error ${err}`);
    }
  });

  it('should not be able to increase a non existent product quantity', async () => {
    mockingoose(ProductCollection).toReturn(undefined, 'findOne');
    mockingoose(ProductCollection).toReturn(undefined, 'save');

    try {
      await productController.updateProductQuantity('Arabica coffee', 'INCREASE');
      fail('Increase quantity for a non existent product');
    } catch (err) {
      expect(err.message).toBe('Failed to find product Arabica coffee');
    }
  });

  it('should not be able to decrease a product with zero quantity', async () => {
    const mockedProduct = {
      name: 'Arabica coffee', 
      price: 6.48,
      quantity: 0
    }

    mockingoose(ProductCollection).toReturn(mockedProduct, 'findOne');
    mockingoose(ProductCollection).toReturn(mockedProduct, 'save');

    try {
      await productController.updateProductQuantity('Arabica coffee', 'DECREASE');
      fail('Decrease for a product with zero quantity did not returned an error')
    } catch (err) {
      expect(err.message).toBe('Failed to drecrement product Arabica coffee, insuficient quantity');
    }
  });

  it('should be able to decrease a product with > 0 quantity', async () => {
    const mockedProduct = {
      name: 'Arabica coffee', 
      price: 6.48,
      quantity: 1
    }

    mockingoose(ProductCollection).toReturn(mockedProduct, 'findOne');
    mockingoose(ProductCollection).toReturn(mockedProduct, 'save');

    try {
      await productController.updateProductQuantity('Arabica coffee', 'DECREASE');
      expect(true).toBe(true);
    } catch (err) {
      fail(`Decrease quantity for a valid product returned an error ${err}`);
    }
  });
});