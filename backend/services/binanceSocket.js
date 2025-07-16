import WebSocket from 'ws';
import { updatePrice } from './renkoEngine.js';

export function startBinanceSocket() {
  const ws = new WebSocket('wss://stream.binance.us:9443/ws/btcusdt@aggTrade', {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Origin': 'https://render.com'
    }
  });

  ws.on('open', () => {
    console.log('✅ Binance WebSocket connected');
  });

  ws.on('message', (data) => {
    try {
      const parsed = JSON.parse(data);
      const bid = parseFloat(parsed.p); // 'p' is price in aggTrade
      const ask = parseFloat(parsed.p); // use same for ask if not available

      if (!isNaN(bid) && !isNaN(ask)) {
        updatePrice(bid, ask);
      }
    } catch (err) {
      console.error('WebSocket message error:', err.message);
    }
  });

  ws.on('close', () => {
    console.log('⚠️ Binance WebSocket disconnected, retrying...');
    setTimeout(startBinanceSocket, 3000);
  });

  ws.on('error', (err) => {
    console.error('❌ Binance WebSocket error:', err.message);
  });
}
