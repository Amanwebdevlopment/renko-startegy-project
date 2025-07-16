// server.js
import app from "./index.js";
import { startBinanceSocket } from './services/binanceSocket.js';
import { startRenkoEngine } from './services/renkoEngine.js';

const PORT = process.env.PORT || 4000;

// Start the strategy engine
startBinanceSocket();
[150,500,1000].forEach(startRenkoEngine);

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
