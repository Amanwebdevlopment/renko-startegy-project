import Trade from '../models/tradeModel.js';
import RenkoBrick from '../models/renkoModel.js';

const engines = {};

export function updatePrice(bid, ask) {
  Object.values(engines).forEach(engine => engine.process(bid, ask));
}

export function startRenkoEngine(brickSize) {
  console.log(`🚀 Starting Renko engine for brick size ${brickSize}`);

  let lastBrickPrice = null;
  let position = null;
  let totalProfit = 0;

  engines[brickSize] = {
    process(bid, ask) {
      const price = (bid + ask) / 2; // Mid price
      const rounded = Math.floor(price / brickSize) * brickSize;

      if (lastBrickPrice === null) {
        lastBrickPrice = rounded;
        storeBrick(lastBrickPrice, 'green', brickSize);
        return;
      }

      const diff = price - lastBrickPrice;
      const bricksToAdd = Math.floor(Math.abs(diff) / brickSize);

      if (bricksToAdd >= 1) {
        const direction = Math.sign(diff);
        for (let i = 1; i <= bricksToAdd; i++) {
          lastBrickPrice += brickSize * direction;
          const color = direction > 0 ? 'green' : 'red';
          storeBrick(lastBrickPrice, color, brickSize);
          handleTrade(lastBrickPrice, color, brickSize);
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
    const feeRate = 0.001; // 0.1%

    if (!position) {
      position = { side, price };
      return;
    }

    if (position.side !== side) {
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
      position = { side, price };
    }
  }
}
