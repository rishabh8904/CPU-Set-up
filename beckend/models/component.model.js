const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const componentSchema = new Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  vendor: { type: String },
  url: { type: String },
  specs: { type: Object }
}, {
  timestamps: true,
});

const Component = mongoose.model('Component', componentSchema);

module.exports = Component;