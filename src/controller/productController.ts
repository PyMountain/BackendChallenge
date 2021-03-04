import { AppError } from "../error/AppError";
import { Product, ProductCollection } from "../model/product";

export default class ProductController {

  async getProduct(productName: string):Promise<Product> {
    const retrievedProduct = await ProductCollection.findOne({name: productName});

    if(retrievedProduct) return retrievedProduct;
    else throw new AppError(`Could not get product with name ${productName}`, 404);
  }
}