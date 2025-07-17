import Trade from '../models/tradeModel.js';
import RenkoBrick from '../models/renkoModel.js';

const engines = {};

export function updatePrice(bid, ask) {
  const price = (bid + ask) / 2;
  Object.values(engines).forEach(engine => engine.process(price));
}

export function startRenkoEngine(brickSize) {
  console.log(`🚀 Starting Renko engine for brick size ${brickSize}`);

  let lastBrickPrice = null;
  let position = null;
  let totalProfit = 0;
  let currentTrend = null; // 'up' or 'down'
  let reversalCount = 0;

  engines[brickSize] = {
    process(price) {
      const rounded = Math.floor(price / brickSize) * brickSize;

      if (lastBrickPrice === null) {
        lastBrickPrice = rounded;
        storeBrick(lastBrickPrice, 'green', brickSize);
        currentTrend = 'up';
        return;
      }

      const diff = price - lastBrickPrice;
      const bricksToAdd = Math.floor(Math.abs(diff) / brickSize);

      if (bricksToAdd >= 1) {
        const direction = Math.sign(diff);
        const newTrend = direction > 0 ? 'up' : 'down';

        for (let i = 1; i <= bricksToAdd; i++) {
          lastBrickPrice += brickSize * direction;
          const color = direction > 0 ? 'green' : 'red';
          storeBrick(lastBrickPrice, color, brickSize);

          if (newTrend === currentTrend) {
            reversalCount = 0;
            handleTrade(lastBrickPrice, color, brickSize); // Continue trade
          } else {
            reversalCount++; // Wait for 2 opposite bricks
            if (reversalCount >= 2) {
              currentTrend = newTrend;
              handleTrade(lastBrickPrice, color, brickSize); // Confirm reversal
              reversalCount = 0;
            }
          }
        }
      }
    },
  };

  function storeBrick(price, color, brickSize) {
    const brick = new RenkoBrick({ price, color, brickSize });
    brick.save().catch(console.error);
  }

  function handleTrade(price, color, brickSize) {
    const side = color === 'green' ? 'buy' : 'sell';
    const feeRate = 0.001;

    if (!position) {
      // First position, just open
      position = { side, price };
      return;
    }

    if (position.side === side) {
      // Same direction, update the price
      position.price = price;
      return;
    }

    // Now confirmed reversal — close existing position and open new
    const entry = position.price;
    const exit = price;
    const gross = position.side === 'buy' ? exit - entry : entry - exit;
    const fee = (entry + exit) * feeRate;
    const net = gross - fee;
    totalProfit += net;

    const trade = new Trade({
      entryPrice: entry,
      exitPrice: exit,
      side: position.side,
      grossProfit: gross,
      fee,
      netProfit: net,
      brickSize,
    });

    trade.save().catch(console.error);

    // Open opposite direction
    position = { side, price };
  }
}
