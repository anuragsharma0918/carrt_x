const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, default: '1' },
  note: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  isBought: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
