import { AppError } from "../error/AppError";
import { Product, ProductCollection } from "../model/product";

export default class ProductController {

  async getProduct(productName: string):Promise<Product> {
    const retrievedProduct = await ProductCollection.findOne({name: productName});

    if(retrievedProduct) return retrievedProduct;
    else throw new AppError(`Could not get product with name ${productName}`, 404);
  }

  async updateProductQuantity(productName: string, action: 'INCREASE' | 'DECREASE') {
    const product = await ProductCollection.findOne({name: productName});

    if(!product) throw new Error(`Failed to find product ${productName}`);

    switch(action){
      case 'DECREASE':
        if(product.quantity <= 0) throw new Error(`Failed to drecrement product ${productName}, insuficient quantity`);
        product.quantity--;
        try{ 
          await product.save();
        } catch (err){ 
          throw new Error(err);
        }
      default:
        product.quantity++;
        try{ 
          await product.save();
        } catch (err){ 
          throw new Error(err);
        }
    }
  }
}