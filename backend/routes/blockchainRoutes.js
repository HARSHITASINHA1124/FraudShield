import { Router } from "express";
import { blockchain } from "../blockchain/blockchain.js";

const router = Router();

router.get("/blockchain", (req, res) => {
    res.json(blockchain.getChain());
});

export default router;
