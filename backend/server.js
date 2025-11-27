// server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transactionRoutes.js";
import blockchainRoutes from "./routes/blockchainRoutes.js";

// Import your existing modules
import authRoutes from "./routes/auth.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);             // Auth routes (signup/login)
app.use("/api/transaction", transactionRoutes);  // Transaction / ML prediction route
app.use("/api", blockchainRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
