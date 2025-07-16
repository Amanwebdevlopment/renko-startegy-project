// backend/index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import strategyRoutes from "./routes/strategyRoutes.js";

dotenv.config();

const app = express();

// ✅ Middleware first
app.use(cors());
app.use(express.json());

// ✅ Connect DB
connectDB();

// ✅ API Routes
app.use("/api/v1/strategy", strategyRoutes);

// ✅ Optional: health check
app.get("/healthz", (req, res) => res.send("OK"));

export default app;
