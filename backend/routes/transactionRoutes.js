import express from "express";
import { handleTransaction } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", handleTransaction);

export default router;
