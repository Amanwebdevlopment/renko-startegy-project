// models/RenkoBrick.js
import mongoose from 'mongoose';

const renkoSchema = new mongoose.Schema({
  symbol: { type: String, default: 'BTCUSDT' },
  price: Number,
  color: String, // 'green' or 'red'
  brickSize: Number,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('RenkoBrick', renkoSchema);
