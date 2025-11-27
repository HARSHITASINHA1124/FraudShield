import crypto from "crypto";
import fs from "fs";

const chainFile = "./blockchain/chain.json";

export class Blockchain {
    constructor() {
        if (fs.existsSync(chainFile)) {
            const data = fs.readFileSync(chainFile);
            this.chain = JSON.parse(data);
        } else {
            this.chain = [];
            this.createGenesisBlock();
        }
    }

    createGenesisBlock() {
        const genesis = this.createBlock("GENESIS", "0");
        this.chain.push(genesis);
        this.saveChain();
    }

    createBlock(transaction, previousHash) {
        const block = {
            index: this.chain.length,
            timestamp: new Date().toISOString(),
            transaction,
            previousHash,
            hash: ""
        };
        block.hash = this.generateHash(block);
        return block;
    }

    generateHash(block) {
        return crypto
            .createHash("sha256")
            .update(JSON.stringify(block))
            .digest("hex");
    }

    addBlock(transaction) {
        const prevHash = this.chain[this.chain.length - 1].hash;
        const newBlock = this.createBlock(transaction, prevHash);
        this.chain.push(newBlock);
        this.saveChain();
        return newBlock;
    }

    saveChain() {
        fs.writeFileSync(chainFile, JSON.stringify(this.chain, null, 2));
    }

    getChain() {
        return this.chain;
    }
}

export const blockchain = new Blockchain();
