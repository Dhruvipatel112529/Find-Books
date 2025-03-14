const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
  payment_id: {
    type: String,
    primary_key : true
  },
  order_id: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  payment_date: {
    type: Date,
    // required: true
  },
  payment_method: {
    type: String,
    required: true,
    enum : ["Razorpay","COD"]
  },
  payment_status: {
    type: String,
    required: true,
    enum: ["Pending", "Completed","Process"]
  },
  total_payment: {
    type: Number,
    required: true
  },
  transaction_Type: {
    type: String,
    required: true,
    enum : ["credit",'debit']
  }
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;