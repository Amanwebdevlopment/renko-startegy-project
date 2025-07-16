import mongoose from "mongoose";
const tradeSchema = new mongoose.Schema({
    symbol: { type: String, default: 'BTCUSDT' },
    entryPrice: Number,
    exitPrice: Number,
    side: String, // 'buy' or 'sell'
    grossProfit: Number,
    fee: Number,
    netProfit: Number,
    brickSize: Number,
    timestamp: { type: Date, default: Date.now }
});
export default mongoose.model('Trade', tradeSchema);