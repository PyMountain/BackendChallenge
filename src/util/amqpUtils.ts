import ProductController from '../controller/productController';
import amqp from 'amqplib/callback_api';

const productController: ProductController = new ProductController();

export async function processStockQueue(message: amqp.Message | null, action: 'INCREASE' | 'DECREASE', queueName: string) {
  const productName = stringuifyMessage(message);
  try{
    await productController.updateProductQuantity(productName, action);
  } catch(err) {
    //In a real world situation, this would be an alert to an email or telegram group
    console.log(`FAILED TO PROCESS QUEUE ${queueName}, ${err}`)
  }
}

function stringuifyMessage(message: amqp.Message | null): string {
  if(!message) return "nameless"
  else {
    return message.content.toString().replace(/\"/gi, '');
  }

}