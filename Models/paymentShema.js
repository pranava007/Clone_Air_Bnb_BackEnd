import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionKey: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['completed', 'failed'],
    required: true,
  },
}, {
  timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
