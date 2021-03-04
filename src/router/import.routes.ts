import { Router } from 'express';
import { ProductCollection } from "../model/product";
import csv from 'csv-parser';
import fs from 'fs'
import path from 'path'
import { Product } from '../model/product';

const importRouter = Router();

importRouter.post('/products', async (req, res, next) => {
  try {
    const csvPath: string = path.resolve(__dirname, '..', 'resources', 'products.csv');
    const parsingErrors: string[] = [];

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', async (data) => {
        try{
          const parsedData:Product = {
            name: data?.name,
            price: Number(data?.price),
            quantity: Number(data?.quantity)
          };
  
          if(parsedData.name && parsedData.price != NaN && parsedData.quantity != NaN) {
            await ProductCollection.create(parsedData);
          } else {
            throw new Error("Failed to parse");
          }
        } catch (err) {
          parsingErrors.push(`failed to retrieve product ${data?.name || 'with no name'}, ${err}`)
        }
      }).on('end', async () => {
        res.status(200).json({
          message: "Begun import of products available in /src/resources/products.csv",
          parsingErrors
        })
      });
  } catch (err) {
    next(err);
  }
});

export default importRouter;