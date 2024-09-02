import Stripe from 'stripe';
import { v4 as uuidv4 } from 'uuid';
import Payment from '../Models/paymentShema.js';
import Booking from '../Models/bookingModle.js';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (req, res) => {
    const { Product, token, userId, bookingId, amount } = req.body;
    const transactionKey = uuidv4();

    try {
        // Log the received data
        console.log("Received data:", { Product, token, userId, bookingId, amount });

        // Ensure amount is greater than zero
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: "Invalid amount. Must be greater than 0." });
        }

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id,
        });

        const charge = await stripe.charges.create({
            amount, // Amount in cents
            currency: "inr",
            customer: customer.id,
            receipt_email: token.email,
            description: Product.name,
        });

        // Save payment details to the database
        const payment = new Payment({
            productId: Product._id,
            userId,
            amount: amount / 100, // Convert back to INR for storage
            transactionKey,
            status: 'completed',
        });

        await payment.save();

        // Update the booking status to "confirmed" after successful payment
        if (bookingId) {
            await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed', transactionKey }, { new: true });
        }

        res.json({ success: true, charge });
    } catch (error) {
        console.error('Payment Error:', error.message);

        // Save failed payment attempt to the database
        const payment = new Payment({
            productId: Product._id,
            userId,
            amount: amount / 100, // Convert back to INR for storage
            transactionKey,
            status: 'failed',
        });

        await payment.save();

        // Optionally, update the booking status to "canceled" or leave it as "pending"
        if (bookingId) {
            await Booking.findByIdAndUpdate(bookingId, { status: 'canceled' }, { new: true });
        }

        res.status(500).json({ success: false, message: "Payment failed", error: error.message });
    }
};
