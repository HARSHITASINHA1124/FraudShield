import { getRiskScore } from "../mlService.js";

import { blockchain } from "../blockchain/blockchain.js";

export async function handleTransaction(req, res) {
    try {
        const transaction = req.body;

        const { riskScore } = await getRiskScore(transaction);
        const status = riskScore > 0.7 ? "BLOCKED" : "APPROVED";

        blockchain.addBlock({
            ...transaction,
            riskScore,
            status
        });


        res.json({ transaction, riskScore, status });
    } catch (err) {
        res.status(500).json({ error: err.toString() });
    }
}
