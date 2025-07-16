// jobs/strategyRunner.js
import { startBinanceSocket } from '../services/binanceSocket.js';
import { startRenkoEngine } from '../services/renkoEngine.js';

export function startRenkoEngines() {
  // Start Binance price feed
  startBinanceSocket();

  // Read brick sizes from env
  const brickSizes = process.env.BRICK_SIZES?.split(',').map(Number) || [50];

  for (const size of brickSizes) {
    startRenkoEngine(size);
  }
}
