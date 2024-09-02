import express from 'express';
import { processPayment } from '../Controllers/paymentController.js';



const paymentRouter = express.Router();

// Route to handle payment processing
paymentRouter.post('/process', processPayment);

export default paymentRouter;
