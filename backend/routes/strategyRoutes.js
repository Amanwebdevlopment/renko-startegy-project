// routes/strategyRoutes.js
import express from 'express';
import {
  getTrades,
  getBricks,
  getStats,
  deleteTrades,
} from '../controllers/strategyController.js';

const router = express.Router();
// get trades data 
router.get('/trades', getTrades);
// delete all trades data 
router.delete('/trades', deleteTrades);
router.get('/bricks', getBricks);
router.get('/stats', getStats);

export default router;
