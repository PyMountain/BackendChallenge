import { Router } from "express";
import ProductController from "../controller/productController";

const productRouter = Router();
const productController = new ProductController();

productRouter.get("/:name", async (req, res, next) => {
  try {
    const productName = req.params.name;
    const retrievedProduct = await productController.getProduct(productName);

    res.status(200).json(retrievedProduct);
  } catch (err) {
    next(err);
  }
});

export default productRouter;