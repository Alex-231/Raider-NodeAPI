import { Schema } from 'mongoose';
import { ColorSchema } from './Color';

export const EmblemSchema = new Schema({
    layer2Color: {
        type: ColorSchema,
        required: true,
    },
    layer1Color: {
        type: ColorSchema,
        required: true,
    },
    layer0Color: {
        type: ColorSchema,
        required: true,
    },
    layer2: {
        type: Boolean,
        required: true,
    },
    layer1: {
        type: Number,
        required: true,
    },
    layer0: {
        type: Number,
        required: true,
    }
});