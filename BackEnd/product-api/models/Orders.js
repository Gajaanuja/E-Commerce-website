const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{ productId: String, quantity: Number }],
  total: Number,
  status: { type: String, default: 'pending' }
});
module.exports = mongoose.model('Order', OrderSchema);
