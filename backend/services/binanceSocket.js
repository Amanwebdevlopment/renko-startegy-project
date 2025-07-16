// services/binanceSocket.js
import WebSocket from 'ws';
import { updatePrice } from './renkoEngine.js';

export function startBinanceSocket() {
  const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@bookTicker');

  ws.on('open', () => {
    console.log(' Binance WebSocket connected');
  });

  ws.on('message', (data) => {
    try {
      const parsed = JSON.parse(data);
      const bid = parseFloat(parsed.b);
      const ask = parseFloat(parsed.a);

      if (!isNaN(bid) && !isNaN(ask)) {
        updatePrice(bid, ask); // Feed into renkoEngine
      }
    } catch (err) {
      console.error('WebSocket message error:', err.message);
    }
  });

  ws.on('close', () => {
    console.log('Binance WebSocket disconnected');
    setTimeout(startBinanceSocket, 3000); // Retry after 3s
  });

  ws.on('error', (err) => {
    console.error('Binance WebSocket error:', err.message);
  });
}
