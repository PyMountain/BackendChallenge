import mongoose, { Schema, Document } from 'mongoose';

export interface Product {
  name: string,
  price: number,
  quantity: number,
}

export interface ProductDocument extends Product, Document {};

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
},
{ 
  versionKey: false 
}
);

export const ProductCollection = mongoose.model<ProductDocument>('products', ProductSchema);