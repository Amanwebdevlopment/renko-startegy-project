import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import strategyRoutes from "./routes/strategyRoutes.js";
import cors from "cors";
app.use(cors()); // Allow all origins by default

dotenv.config();
const app = express();

app.use(express.json());

// Connect DB
connectDB();

// API Routes
app.use("/api/v1/strategy", strategyRoutes);

export default app;
