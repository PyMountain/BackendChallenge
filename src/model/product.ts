import mongoose, { Schema, Document } from 'mongoose';
const Double = require('@mongoosejs/double');

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
    type: Double,
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