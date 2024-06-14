import { Router } from 'express';
import Web3 from 'web3';
import StETHController from '../controllers/StETHController';
import dotenv from 'dotenv';

dotenv.config();

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`);
  }
  return value;
}

const INFURA_PROJECT_ID = getEnvVar('INFURA_PROJECT_ID');
const STETH_CONTRACT_ADDRESS = getEnvVar('STETH_CONTRACT_ADDRESS');
const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}`);
const stETHController = new StETHController(web3, STETH_CONTRACT_ADDRESS);

const router = Router();

router.get(
  '/totalPooledETHAndShares',
  stETHController.getTotalPooledETHAndShares
);
router.get('/mostRecentDepositor', stETHController.getMostRecentDepositor);
router.get('/transactions/:address', stETHController.getAllTransactions);
// router.get('/transfers/:address', stETHController.getStETHTransfers);
// router.get('/balances/:address', stETHController.getTokenBalances);

export default router;
