import mongoose, { Schema, Document } from 'mongoose';
import { Product } from './product'
const AutoIncrement = require('mongoose-sequence')(mongoose);

export interface Order {
  products: Product[],
  total: number
}

export interface OrderDocument extends Order, Document {};

const OrderSchema = new Schema({
  products: {
    type: Schema.Types.Mixed,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
},
{ 
  versionKey: false 
}
);

OrderSchema.plugin(AutoIncrement, {inc_field: 'id'})

export const OrderCollection = mongoose.model<OrderDocument>('Orders', OrderSchema);