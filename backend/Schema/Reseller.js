const mongoose = require('mongoose');
const { Schema } = mongoose;

const resellerSchema = new Schema({
  reseller_id: {
    type: Schema.Types.ObjectId,
    primary_key : true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  },
  address: {
    type: String,
    required: true
  },
  upi_id: {
    type: String,
    required: false 
  },
  bank_acc_no: {
    type: String,
    required: false 
  },
  ifsc_code: {
    type: String,
    required: false 
  }
});

module.exports = mongoose.model('Reseller', resellerSchema);

