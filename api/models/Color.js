/* eslint-disable import/prefer-default-export */
import { Schema } from 'mongoose';

export const ColorSchema = new Schema({
  r: {
    type: Number,
    default: 0,
    required: true,
  },
  g: {
    type: Number,
    default: 0,
    required: true,
  },
  b: {
    type: Number,
    default: 0,
    required: true,
  },
});
