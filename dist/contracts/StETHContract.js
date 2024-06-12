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
// Define ABI for the stETH contract
const stETHAbi = [
// ABI items here
];
class StETHContract {
    constructor(web3, contractAddress) {
        this.web3 = web3;
        this.contractAddress = contractAddress;
        this.contractInstance = new this.web3.eth.Contract(stETHAbi, contractAddress);
    }
    getTotalPooledETHAndShares() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalPooledETH = yield this.contractInstance.methods.getTotalPooledEther().call();
                const totalShares = yield this.contractInstance.methods.totalSupply().call();
                return { totalPooledETH, totalShares };
            }
            catch (error) {
                throw new Error(`Failed to fetch total pooled ETH and shares: ${error.message}`);
            }
        });
    }
    getMostRecentDepositor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const events = yield this.contractInstance.getPastEvents('Transfer', {
                    filter: { to: this.contractAddress },
                    fromBlock: 'latest',
                    toBlock: 'latest',
                });
                return events.length > 0 ? events[0].returnValues.from : '';
            }
            catch (error) {
                throw new Error(`Failed to fetch the most recent depositor: ${error.message}`);
            }
        });
    }
    getAllTransactions(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!web3_1.default.utils.isAddress(address)) {
                throw new Error('Invalid address provided');
            }
            try {
                const currentBlock = yield this.web3.eth.getBlockNumber();
                const events = yield this.contractInstance.getPastEvents('allEvents', {
                    filter: { from: address, to: address },
                    fromBlock: 0,
                    toBlock: currentBlock,
                });
                return events;
            }
            catch (error) {
                throw new Error(`Failed to fetch transactions for address ${address}: ${error.message}`);
            }
        });
    }
    getStETHTransfers(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!web3_1.default.utils.isAddress(address)) {
                throw new Error('Invalid address provided');
            }
            try {
                const events = yield this.contractInstance.getPastEvents('Transfer', {
                    filter: { from: address, to: address },
                    fromBlock: 0,
                    toBlock: 'latest',
                });
                return events;
            }
            catch (error) {
                throw new Error(`Failed to fetch stETH transfers for address ${address}: ${error.message}`);
            }
        });
    }
    getTokenBalances(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!web3_1.default.utils.isAddress(address)) {
                throw new Error('Invalid address provided');
            }
            try {
                const ethBalance = yield this.web3.eth.getBalance(address);
                const stETHBalance = yield this.contractInstance.methods.balanceOf(address).call();
                return {
                    ETH: this.web3.utils.fromWei(ethBalance, 'ether'),
                    stETH: this.web3.utils.fromWei(stETHBalance, 'ether'),
                };
            }
            catch (error) {
                throw new Error(`Failed to fetch token balances for address ${address}: ${error.message}`);
            }
        });
    }
}
exports.default = StETHContract;
