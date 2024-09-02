import Stripe from "stripe";
import { v4 as uuidv4 } from 'uuid';
import Payment from '../Models/bookingModle.js';
import dotenv from 'dotenv';


dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (req, res) => {
    const { Product, token, userId } = req.body;
    const transactionKey = uuidv4();

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        });

        const charge = await stripe.charges.create({
            amount: Product.price * 100,
            currency: "inr",
            customer: customer.id,
            receipt_email: token.email,
            description: Product.name,
        });

        // Save payment details to the database
        const payment = new Payment({
            productId: Product._id,
            userId,
            amount: Product.price,
            transactionKey,
            status: 'completed',
        });

        await payment.save();

        res.json({ success: true, charge });
    } catch (error) {
        console.error(error);

        // Save failed payment attempt to the database
        const payment = new Payment({
            productId: Product._id,
            userId,
            amount: Product.price,
            transactionKey,
            status: 'failed',
        });

        await payment.save();

        res.status(500).json({ success: false, message: "Payment failed", error: error.message });
    }
};
