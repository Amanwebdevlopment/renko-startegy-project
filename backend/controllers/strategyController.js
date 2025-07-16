// controllers/strategyController.js
import Trade from '../models/tradeModel.js';
import RenkoBrick from '../models/renkoModel.js';

export const getTrades = async (req, res) => {
  const filter = {};
  if (req.query.brickSize) {
    filter.brickSize = parseInt(req.query.brickSize);
  }

  const trades = await Trade.find(filter).sort({ timestamp: -1 }).limit(100);
  res.json(trades);
};


export const getBricks = async (req, res) => {
  const bricks = await RenkoBrick.find().sort({ timestamp: -1 }).limit(100);
  res.json(bricks);
};

export const getStats = async (req, res) => {
  const trades = await Trade.find();
  const total = trades.length;
  const profitable = trades.filter(t => t.netProfit > 0).length;
  const totalNet = trades.reduce((acc, t) => acc + t.netProfit, 0);
  const brickStats = {};

  for (const t of trades) {
    const key = t.brickSize;
    if (!brickStats[key]) {
      brickStats[key] = { count: 0, net: 0 };
    }
    brickStats[key].count++;
    brickStats[key].net += t.netProfit;
  }

  res.json({
    totalTrades: total,
    profitableTrades: profitable,
    winRate: total > 0 ? (profitable / total * 100).toFixed(2) + "%" : "0%",
    totalNetProfit: totalNet.toFixed(2),
    brickPerformance: brickStats
  });
};
// delete data single or multiple both
export const deleteTrades = async (req, res) => {
  try {
    const { brickSize } = req.query;

    if (brickSize) {
      const result = await Trade.deleteMany({ brickSize: parseInt(brickSize) });
      return res.json({ message: `Deleted trades for brick size ${brickSize}`, deleted: result.deletedCount });
    } else {
      const result = await Trade.deleteMany({});
      return res.json({ message: 'Deleted ALL trades', deleted: result.deletedCount });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete trades' });
  }
};