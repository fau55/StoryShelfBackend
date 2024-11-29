import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const cartSchema = new Schema({
    userId: { type: String, required: true },
    items: [
        {
            productId: {
                type: String
            },
            quantity: {
                type: Number
            },
            priceAtPurchase: {
                type: Number
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true

    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

const Cart = mongoose.model('Cart', cartSchema);
export { Cart };