const mongoose = require("mongoose");
const Schema=mongoose.Schema

const paymentSchema = new Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  paymentSessionId: {
    type: String
  },
  orderAmount: {
    type: Number,
    required: true
  },
  orderCurrency: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    required: true
  },
  orderId:{
    type:Schema.Types.ObjectId,ref:"Order",
  }
},{
  timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);