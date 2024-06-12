"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = __importDefault(require("web3"));
const StETHContract_1 = __importDefault(require("../contracts/StETHContract"));
class StETHController {
    constructor(web3, contractAddress) {
        this.getTotalPooledETHAndShares = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.stETHContract.getTotalPooledETHAndShares();
                res.json(data);
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.getMostRecentDepositor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const depositor = yield this.stETHContract.getMostRecentDepositor();
                res.json({ depositor });
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.getAllTransactions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const address = req.params.address;
            if (!web3_1.default.utils.isAddress(address)) {
                return res.status(400).json({ error: 'Invalid address' });
            }
            try {
                const transactions = yield this.stETHContract.getAllTransactions(address);
                res.json(transactions);
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.getStETHTransfers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const address = req.params.address;
            if (!web3_1.default.utils.isAddress(address)) {
                return res.status(400).json({ error: 'Invalid address' });
            }
            try {
                const transfers = yield this.stETHContract.getStETHTransfers(address);
                res.json(transfers);
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.getTokenBalances = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const address = req.params.address;
            if (!web3_1.default.utils.isAddress(address)) {
                return res.status(400).json({ error: 'Invalid address' });
            }
            try {
                const balances = yield this.stETHContract.getTokenBalances(address);
                res.json(balances);
            }
            catch (error) {
                res.status(500).json({ error: 'Internal server error' });
            }
        });
        this.stETHContract = new StETHContract_1.default(web3, contractAddress);
    }
}
exports.default = StETHController;
