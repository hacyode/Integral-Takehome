"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/stETHRoutes.ts
const express_1 = require("express");
const web3_1 = __importDefault(require("web3"));
const StETHController_1 = __importDefault(require("../controllers/StETHController"));
// Initialize Web3 and the StETHController
const web3 = new web3_1.default('https://mainnet.infura.io/v3/9019bc5078444cebbaf680830851180b');
const stETHController = new StETHController_1.default(web3, '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84');
const router = (0, express_1.Router)();
router.get('/totalPooledETHAndShares', stETHController.getTotalPooledETHAndShares);
router.get('/mostRecentDepositor', stETHController.getMostRecentDepositor);
router.get('/transactions/:address', stETHController.getAllTransactions);
router.get('/transfers/:address', stETHController.getStETHTransfers);
router.get('/balances/:address', stETHController.getTokenBalances);
exports.default = router;
