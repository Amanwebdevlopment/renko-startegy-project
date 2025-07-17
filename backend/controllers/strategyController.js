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
  try {
    const trades = await Trade.find();

    const summaryMap = {};

    for (const trade of trades) {
  const size = trade.brickSize;

  if (!summaryMap[size]) {
    summaryMap[size] = {
      brickSize: size,
      totalTrades: 0,
      winTrades: 0,
      lossTrades: 0,
      totalGrossProfit: 0,
      totalFee: 0,
      finalProfit: 0,
      maxProfit: -Infinity,
      maxLoss: Infinity,
    };
  }

  const stats = summaryMap[size];

  stats.totalTrades += 1;
  stats.totalGrossProfit += trade.grossProfit;
  stats.totalFee += trade.fee;
  stats.finalProfit += trade.netProfit;

  if (trade.netProfit >= 0) {
    stats.winTrades += 1;
  } else {
    stats.lossTrades += 1;
  }

  // ✅ Fix here
  if (trade.grossProfit > stats.maxProfit) {
    stats.maxProfit = trade.grossProfit;
  }

  if (trade.grossProfit < stats.maxLoss) {
    stats.maxLoss = trade.grossProfit;
  }
}


    const summaryArray = Object.values(summaryMap).sort((a, b) => a.brickSize - b.brickSize);

    res.json(summaryArray);

  } catch (error) {
    console.error('❌ Trade stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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